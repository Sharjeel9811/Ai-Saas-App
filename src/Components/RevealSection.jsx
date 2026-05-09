import { motion } from 'framer-motion'

const RevealSection = ({ children, delay = 0 }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.section>
  )
}

export default RevealSection
