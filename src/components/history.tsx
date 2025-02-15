import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HistoryDisplay({ history }: { history: string }) {
  return (
    <AnimatePresence>
      {history && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-12 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-zinc-100 dark:bg-zinc-800/80 dark:border-zinc-700"
        >
          <div className="prose prose-zinc max-w-none dark:prose-invert">
            {history.split("\n\n").map((section, index) => {
              if (section.startsWith("**")) {
                return (
                  <h2 key={index} className="text-2xl font-bold mt-6">
                    {section.replace(/\*\*/g, "")}
                  </h2>
                );
              } else if (section.startsWith("* ")) {
                return (
                  <ul key={index} className="list-disc pl-6">
                    {section.split("\n").map((point, idx) => (
                      <li key={idx}>{point.replace("* ", "")}</li>
                    ))}
                  </ul>
                );
              } else {
                return <p key={index}>{section}</p>;
              }
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
