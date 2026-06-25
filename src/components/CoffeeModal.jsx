import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createCardPayment, createPixPayment } from '../services/coffeePaymentService';

const PAYMENT_METHODS = {
  pix: 'Pix',
  card: 'Cartão',
};

const mercadoPagoPublicKey = import.meta.env.VITE_MP_PUBLIC_KEY || 'APP_USR-bd4c6a88-befa-4ae0-b0d1-5f30bda8e413';

function isFeatureFlagEnabled(value) {
  return !['false', '0', 'off', 'no'].includes(String(value).trim().toLowerCase());
}

const isPaymentEnabled = isFeatureFlagEnabled(__PAGAMENTO_ON__);

function parseContributionValue(value) {
  const normalizedValue = value.replace(',', '.');
  return Number(normalizedValue);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function normalizeAmount(value) {
  const numericAmount = parseContributionValue(value);

  if (!Number.isFinite(numericAmount)) {
    return 0;
  }

  return Number(numericAmount.toFixed(2));
}

function CoffeeModal({ isOpen, onClose }) {
  const [contributorName, setContributorName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pixPayment, setPixPayment] = useState(null);
  const [cardPayment, setCardPayment] = useState(null);
  const [isCardBrickVisible, setIsCardBrickVisible] = useState(false);
  const [isCardBrickReady, setIsCardBrickReady] = useState(false);
  const nameInputRef = useRef(null);
  const cardBrickControllerRef = useRef(null);
  const cardBrickContainerId = 'coffee-card-payment-brick';

  const numericAmount = useMemo(() => normalizeAmount(amount), [amount]);

  const resetPaymentResults = useCallback(() => {
    setPixPayment(null);
    setCardPayment(null);
    setIsCardBrickVisible(false);
    setIsCardBrickReady(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    nameInputRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setContributorName('');
      setAmount('');
      setPaymentMethod('');
      setError('');
      setFeedback('');
      setIsLoading(false);
      resetPaymentResults();
    }
  }, [isOpen, resetPaymentResults]);

  useEffect(() => {
    if (paymentMethod !== 'card' || !isCardBrickVisible || !isOpen) {
      return undefined;
    }

    let wasUnmounted = false;

    async function mountCardBrick() {
      try {
        if (!mercadoPagoPublicKey) {
          throw new Error('Configure a variável VITE_MP_PUBLIC_KEY no front-end.');
        }

        if (!window.MercadoPago) {
          throw new Error('SDK do Mercado Pago não foi carregado. Verifique o script no index.html.');
        }

        if (cardBrickControllerRef.current?.unmount) {
          await cardBrickControllerRef.current.unmount();
        }

        const mercadoPago = new window.MercadoPago(mercadoPagoPublicKey, {
          locale: 'pt-BR',
        });
        const bricksBuilder = mercadoPago.bricks();

        const controller = await bricksBuilder.create('cardPayment', cardBrickContainerId, {
          initialization: {
            amount: numericAmount,
          },
          customization: {
            visual: {
              style: {
                theme: 'dark',
              },
            },
            paymentMethods: {
              maxInstallments: 1,
            },
          },
          callbacks: {
            onReady: () => {
              if (!wasUnmounted) {
                setIsCardBrickReady(true);
              }
            },
            onSubmit: (cardFormData) => {
              setIsLoading(true);
              setError('');
              setFeedback('Processando pagamento com cartão...');

              return createCardPayment({
                ...cardFormData,
                contributorName: contributorName.trim(),
                amount: numericAmount,
              })
                .then((payment) => {
                  setCardPayment(payment);
                  setFeedback('Pagamento enviado para processamento.');
                  return payment;
                })
                .catch((paymentError) => {
                  setError(paymentError.message);
                  setFeedback('');
                  throw paymentError;
                })
                .finally(() => {
                  setIsLoading(false);
                });
            },
            onError: (brickError) => {
              console.error('Mercado Pago Card Brick error:', brickError);
              setError('Não foi possível carregar o pagamento com cartão.');
            },
          },
        });

        if (!wasUnmounted) {
          cardBrickControllerRef.current = controller;
        }
      } catch (paymentError) {
        setError(paymentError.message);
        setIsCardBrickVisible(false);
        setIsCardBrickReady(false);
      }
    }

    mountCardBrick();

    return () => {
      wasUnmounted = true;
      if (cardBrickControllerRef.current?.unmount) {
        cardBrickControllerRef.current.unmount();
        cardBrickControllerRef.current = null;
      }
      setIsCardBrickReady(false);
    };
  }, [paymentMethod, isCardBrickVisible, isOpen, numericAmount, contributorName]);

  if (!isOpen) {
    return null;
  }

  function handleNameChange(event) {
    setContributorName(event.target.value);
    setError('');
    setFeedback('');
    resetPaymentResults();
  }

  function handleAmountChange(event) {
    const cleanValue = event.target.value.replace(/[^0-9,.]/g, '');
    const decimalParts = cleanValue.split(/[,.]/);

    if (decimalParts.length > 2) {
      return;
    }

    setAmount(cleanValue);
    setError('');
    setFeedback('');
    resetPaymentResults();
  }

  function handlePaymentMethodSelect(method) {
    setPaymentMethod(method);
    setError('');
    setFeedback('');
    resetPaymentResults();
  }

  function validateForm() {
    if (!contributorName.trim()) {
      return 'Informe seu nome para continuar.';
    }

    if (!amount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return 'Informe um valor válido maior que zero.';
    }

    if (!paymentMethod) {
      return 'Selecione Pix ou Cartão para continuar.';
    }

    return '';
  }

  async function handlePixPayment() {
    setIsLoading(true);
    setFeedback('Gerando Pix...');
    setPixPayment(null);

    try {
      const payment = await createPixPayment({
        contributorName: contributorName.trim(),
        amount: numericAmount,
      });

      setPixPayment(payment);
      setFeedback('Pix gerado com sucesso.');
    } catch (paymentError) {
      setError(paymentError.message);
      setFeedback('');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCardPayment() {
    setIsCardBrickVisible(true);
    setFeedback('Preencha os dados do cartão abaixo.');
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setFeedback('');
      return;
    }

    if (paymentMethod === 'pix') {
      handlePixPayment();
      return;
    }

    handleCardPayment();
  }

  async function handleCopyPixCode() {
    if (!pixPayment?.qrCode) {
      return;
    }

    await navigator.clipboard.writeText(pixPayment.qrCode);
    setFeedback('Código Pix copiado.');
  }

  return (
    <div className="coffee-modal-backdrop" onMouseDown={onClose}>
      <section
        className="coffee-modal panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="coffee-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="coffee-modal-close" type="button" onClick={onClose} aria-label="Fechar modal">
          ×
        </button>

        <div className="coffee-modal-head">
          <span className="eyebrow">Apoie meu trabalho</span>
          <h2 id="coffee-modal-title">Me pague um café</h2>
          <p>Informe seu nome, escolha um valor simbólico e finalize por Pix ou cartão.</p>
        </div>

        <form className="coffee-modal-form" onSubmit={handleSubmit} noValidate>
          <label className="coffee-field" htmlFor="coffee-name">
            <span>Informe seu nome</span>
            <div className="coffee-input-wrap coffee-input-wrap--single">
              <input
                id="coffee-name"
                ref={nameInputRef}
                type="text"
                placeholder="Seu nome"
                value={contributorName}
                maxLength={90}
                onChange={handleNameChange}
                aria-describedby={error ? 'coffee-modal-error' : undefined}
              />
            </div>
          </label>

          <label className="coffee-field" htmlFor="coffee-amount">
            <span>Valor da contribuição</span>
            <div className="coffee-input-wrap">
              <strong>R$</strong>
              <input
                id="coffee-amount"
                type="text"
                inputMode="decimal"
                placeholder="Digite um valor"
                value={amount}
                onChange={handleAmountChange}
                aria-describedby={error ? 'coffee-modal-error' : undefined}
              />
            </div>
          </label>

          <fieldset className="coffee-payment-options">
            <legend>Forma de pagamento</legend>
            {Object.entries(PAYMENT_METHODS).map(([method, label]) => (
              <button
                key={method}
                className={paymentMethod === method ? 'is-selected' : ''}
                type="button"
                onClick={() => handlePaymentMethodSelect(method)}
                aria-pressed={paymentMethod === method}
              >
                {label}
              </button>
            ))}
          </fieldset>

          {!isPaymentEnabled && (
            <p className="coffee-form-message is-warning">
              Pagamentos temporariamente indisponíveis.
            </p>
          )}
          {error && <p id="coffee-modal-error" className="coffee-form-message is-error">{error}</p>}
          {feedback && <p className="coffee-form-message is-success">{feedback}</p>}

          {pixPayment && (
            <div className="coffee-pix-result">
              <strong>Pix de {formatCurrency(pixPayment.amount)}</strong>
              {pixPayment.qrCodeBase64 && (
                <img src={`data:image/png;base64,${pixPayment.qrCodeBase64}`} alt="QR Code Pix" />
              )}
              {pixPayment.qrCode && (
                <>
                  <textarea value={pixPayment.qrCode} readOnly aria-label="Código Pix copia e cola" />
                  <button className="coffee-secondary-action" type="button" onClick={handleCopyPixCode}>
                    Copiar código Pix
                  </button>
                </>
              )}
            </div>
          )}

          {cardPayment && (
            <div className="coffee-card-result">
              <strong>Status do pagamento</strong>
              <span>{cardPayment.statusLabel || cardPayment.status}</span>
              {cardPayment.paymentId && <small>ID Mercado Pago: {cardPayment.paymentId}</small>}
            </div>
          )}

          {!isCardBrickVisible && (
            <button className="coffee-submit" type="submit" disabled={isLoading || !isPaymentEnabled}>
              {!isPaymentEnabled ? 'Pagamento indisponível' : isLoading ? 'Processando...' : 'Continuar pagamento'}
            </button>
          )}
        </form>

        {isCardBrickVisible && (
          <div className="coffee-card-brick-panel">
            {!isCardBrickReady && <p className="coffee-card-loading">Carregando formulário seguro do cartão...</p>}
            <div id={cardBrickContainerId} />
          </div>
        )}
      </section>
    </div>
  );
}

export default CoffeeModal;
