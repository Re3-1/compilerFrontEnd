import { Fragment, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { mathAtom } from "../store/math";
import { useRecoilValue } from "recoil";
import { useAtom } from "jotai";
export function TimelineComponent() {
  const [data, setData] = useState(null);
  const [text,setText]=useAtom(mathAtom);
  const emailText = "2+3;";

  useEffect(() => {
    async function getData() {
      try {
        console.log(text)
        const response = await axios.post("https://553f-2402-8100-2672-5356-55f2-ddbd-2799-2eee.ngrok-free.app/api/compiler/", {
          message: text
        });
        console.log(response.data.message);
        setData(JSON.parse(response.data.message));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getData();
  }, []);

  if (!data) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  const phases = [];
  const directions = ["left", "right"];
  let dirIndex = 0;

  const addPhase = (heading, subheading, description) => {
    phases.push({
      heading,
      subheading,
      description,
      direction: directions[dirIndex % 2]
    });
    dirIndex++;
  };

  function formatAST(ast, indent = 0) {
    if (!ast) return "null";
    const space = " ".repeat(indent);
    if (ast.type === "NUMBER") return `${space}NUMBER(${ast.value})`;
    if (ast.type === "NEG") return `${space}NEG\n${formatAST(ast.operand, indent + 2)}`;
    if (["ADD", "SUB", "MUL", "DIV", "POW"].includes(ast.type))
      return `${space}${ast.type}\n${formatAST(ast.left, indent + 2)}\n${formatAST(ast.right, indent + 2)}`;
    if (ast.operand) return `${space}${ast.type}\n${formatAST(ast.operand, indent + 2)}`;
    return `${space}${JSON.stringify(ast)}`;
  }

  addPhase(
    "Lexical Analysis",
    "Converts source code to tokens.",
    (data.tokens || []).map((expr, i) =>
      `Expression ${i + 1}: ` + expr.map(t => `${t.type}(${t.value})`).join(", ")
    ).join("\n")
  );
  
  addPhase(
    "Syntax Analysis",
    "Builds Abstract Syntax Tree.",
    (data.asts || []).map((ast, i) =>
      `Expression ${i + 1}:\n${formatAST(ast)}`
    ).join("\n\n")
  );
  
  addPhase(
    "Semantic Analysis",
    "Checks for logical/mathematical errors.",
    (data.semantic || []).map((msgs, i) =>
      msgs.length ? `Expression ${i + 1} Errors:\n- ${msgs.join("\n- ")}` : `Expression ${i + 1}: No semantic issues.`
    ).join("\n\n")
  );
  
  addPhase(
    "Intermediate Representation (IR)",
    "Converts to lower-level format.",
    (data.ir || []).map((lines, i) =>
      `Expression ${i + 1}:\n${lines[0]?.join("\n") || "No IR generated."}`
    ).join("\n\n")
  );
  
  addPhase(
    "Optimization",
    "Refines IR for efficiency.",
    (data.opt_ir || []).map((opt, i) =>
      `Expression ${i + 1}:\n` + (Array.isArray(opt)
        ? opt.flat().map(line => Array.isArray(line) ? line.join(", ") : line).join("\n")
        : JSON.stringify(opt))
    ).join("\n\n")
  );
  
  addPhase(
    "Code Generation",
    "Generates assembly/machine code.",
    (data.asm || []).length
      ? data.asm.map((a, i) => `Expression ${i + 1}:\n${a}`).join("\n\n")
      : "No assembly code generated."
  );
  
  addPhase(
    "Execution / Result",
    "Evaluates and outputs result.",
    (data.results || []).map((res, i) =>
      res === null ? `Expression ${i + 1}: Error or undefined result.` : `Expression ${i + 1}: ${res}`
    ).join("\n")
  );
  return (
    <div className="p-6">
      <Timeline events={phases} />
    </div>
  );
}

const Timeline = ({ events }) => {
  const [visibleEvents, setVisibleEvents] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (visibleEvents < events.length) {
      const timer = setTimeout(() => setVisibleEvents((prev) => prev + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [visibleEvents, events.length]);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col gap-y-4 w-full max-w-4xl mx-auto">
      {events.slice(0, visibleEvents).map((event, index) => (
        <Fragment key={index}>
          <Circle />
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4">
            {event.direction === "left" ? (
              <EventCard {...event} isOpen={openIndex === index} onClick={() => handleToggle(index)} />
            ) : (
              <div></div>
            )}
            <Pillar />
            {event.direction === "right" ? (
              <EventCard {...event} isOpen={openIndex === index} onClick={() => handleToggle(index)} />
            ) : (
              <div></div>
            )}
          </div>
        </Fragment>
      ))}
      {visibleEvents === events.length && <Circle />}
    </div>
  );
};

const Circle = () => <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-full w-4 h-4 mx-auto" />;
const Pillar = () => <div className="bg-gradient-to-b from-blue-500 to-teal-500 w-1 h-20 mx-auto rounded-full" />;

const EventCard = ({ heading, subheading, description, direction, isOpen, onClick }) => {
  const motionProps = direction === "left"
    ? { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } }
    : { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } };

  return (
    <motion.div
      {...motionProps}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer flex flex-col gap-y-2 border shadow-md rounded-xl p-4 bg-white max-w-md mx-auto"
    >
      <div className="text-blue-800 font-bold text-lg border-b">{heading}</div>
      <div className="text-sm text-gray-700">{subheading}</div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="extra"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden text-sm text-gray-600 mt-2"
          >
            <pre className="whitespace-pre-wrap">{description}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
