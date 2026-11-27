import React, { useEffect, useRef, useState } from 'react';

type ScanStatus = 'idle' | 'scanning' | 'pending' | 'error';

export const ScanPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [message, setMessage] = useState('Caméra prête à être lancée.');
  const [result, setResult] = useState<null>(null);

  const timeoutRef = useRef<number | null>(null);

  const stopCamera = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startScan = async () => {
    setResult(null);
    setStatus('scanning');
    setMessage('Initialisation de la caméra...');
    try {
      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      }
      setMessage('Scan en cours... En attente de la réponse du modèle backend.');
      timeoutRef.current = window.setTimeout(() => {
        setResult(null);
        setStatus('pending');
        setMessage('Capture terminée. Aucune prédiction: le modèle backend n’est pas encore intégré.');
        timeoutRef.current = null;
      }, 1800);
    } catch {
      setStatus('error');
      setMessage("Impossible d'accéder à la caméra. Vérifiez les autorisations du navigateur.");
    }
  };

  const stopScan = () => {
    stopCamera();
    setStatus('idle');
    setMessage('Scan arrêté. Caméra désactivée.');
  };

  return (
    <section className="hadir-scan-page">
      <div className="hadir-scan-container">
        <div className="hadir-scan-header">
          <div className="hadir-about-badge">
            <span className="hadir-badge-dot" aria-hidden="true" />
            <span>Reconnaissance faciale</span>
          </div>
          <h1 className="hadir-scan-title">
            Scanner la <span className="hadir-highlight-orange">présence</span>
          </h1>
          <p className="hadir-scan-subtitle">
            Lancez la caméra, positionnez le visage dans le cadre, puis démarrez le scan pour enregistrer la présence.
          </p>
        </div>

        <div className="hadir-scan-layout">
          <div className="hadir-scan-camera-card">
            <div className="hadir-scan-camera-top">
              <span className="hadir-scan-live-dot" data-status={status} />
              <span className="hadir-scan-camera-label">Zone caméra</span>
            </div>
            <div className="hadir-scan-camera-zone">
              <video ref={videoRef} className="hadir-scan-video" autoPlay playsInline muted />
              <div className="hadir-scan-overlay" aria-hidden="true">
                <div className="hadir-scan-corner tl" />
                <div className="hadir-scan-corner tr" />
                <div className="hadir-scan-corner bl" />
                <div className="hadir-scan-corner br" />
                {status === 'scanning' && <div className="hadir-scan-line" />}
              </div>
              {!streamRef.current && status === 'idle' && (
                <div className="hadir-scan-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Caméra en attente</span>
                </div>
              )}
            </div>
            <div className="hadir-scan-actions">
              <div className="hadir-scan-actions-row">
                <button type="button" className="hadir-btn-minimal-primary" onClick={startScan} disabled={status === 'scanning'}>
                  {status === 'scanning' ? 'Scan en cours...' : 'Lancer le scan'}
                </button>
                <button type="button" className="hadir-btn-minimal-secondary hadir-scan-stop-btn" onClick={stopScan} disabled={status === 'idle' && !streamRef.current}>
                  Arrêter le scan
                </button>
              </div>
              <p className="hadir-scan-status" data-status={status}>{message}</p>
            </div>
          </div>

          <div className="hadir-scan-result-card">
            <div className="hadir-scan-result-head">
              <h2 className="hadir-scan-result-title">Résultat</h2>
              <span className={`hadir-scan-result-badge ${status === 'pending' ? 'is-pending' : ''}`}>
                {status === 'pending' ? 'En attente backend' : 'En attente'}
              </span>
            </div>

            <div className="hadir-scan-result-empty">
              <p>{status === 'pending' ? 'Scan capturé' : 'Aucun résultat'}</p>
              <p>
                {status === 'pending'
                  ? 'Aucune prédiction affichée. Connectez le modèle backend pour recevoir la reconnaissance.'
                  : 'Le résultat apparaîtra ici lorsque le modèle backend sera intégré.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
