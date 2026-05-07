import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 10 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.18, ease: [0.32, 0.72, 0, 1] } },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      style={{ minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
}
