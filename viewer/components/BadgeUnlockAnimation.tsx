import { motion } from 'framer-motion';

interface BadgeUnlockAnimationProps {
  badgeName: string;
  onComplete?: () => void;
}

export default function BadgeUnlockAnimation({ badgeName, onComplete }: BadgeUnlockAnimationProps) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.6 }}
      onAnimationComplete={onComplete}
      className="badge-unlock"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        textAlign: 'center',
        minWidth: '300px',
      }}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: [0.8, 1.2, 1] }}
        transition={{ duration: 0.6, times: [0, 0.5, 1] }}
        className="badge-icon"
        style={{
          fontSize: '4rem',
          marginBottom: '1rem',
        }}
      >
        🏅
      </motion.div>
      
      <motion.h3
        style={{
          color: 'white',
          fontSize: '1.5rem',
          marginBottom: '0.5rem',
          fontWeight: 'bold',
        }}
      >
        {badgeName}
      </motion.h3>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="badge-text"
        style={{
          color: 'white',
          fontSize: '1.2rem',
        }}
      >
        🎉 คุณได้รับ Badge ใหม่!
      </motion.div>

      {/* Particle burst effect */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos((i * Math.PI * 2) / 8) * 100,
            y: Math.sin((i * Math.PI * 2) / 8) * 100,
          }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#FFD700',
          }}
        />
      ))}
    </motion.div>
  );
}
