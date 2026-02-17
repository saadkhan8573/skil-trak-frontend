export const GlobalStyles = () => (
    <style>{`
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(100%);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @media (min-width: 640px) {
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.8;
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .slot-card {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .slot-card:active:not(:disabled) {
        transform: scale(0.95);
      }
      
      .day-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .day-card:active:not(:disabled) {
        transform: scale(0.97);
      }

      @media (min-width: 640px) {
        .slot-card:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        .day-card:hover:not(:disabled) {
          transform: translateY(-4px);
        }
      }
    `}</style>
)
