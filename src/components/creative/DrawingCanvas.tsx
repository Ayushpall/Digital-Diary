"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  PenTool, 
  Eraser, 
  RotateCcw, 
  Check, 
  Palette, 
  Sliders,
  Paintbrush
} from "lucide-react";
import { inkColorMap } from "@/lib/handwriting-config";
import { HandwritingInkColor } from "@/types/handwriting";

interface DrawingCanvasProps {
  onSaveDrawing: (dataUrl: string) => void;
  onCancel?: () => void;
}

export function DrawingCanvas({
  onSaveDrawing,
  onCancel,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [brushSize, setBrushSize] = useState<number>(3);
  const [ink, setInk] = useState<HandwritingInkColor>("carbon");

  const brushSizes = [
    { size: 2, label: "Fine" },
    { size: 4, label: "Medium" },
    { size: 8, label: "Thick" },
    { size: 14, label: "Brush" },
  ];

  // Set up high DPI canvas resolution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set initial background to transparent
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushSize * 2.5;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = inkColorMap[ink].hex;
      ctx.lineWidth = brushSize;
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onSaveDrawing(dataUrl);
  };

  return (
    <div className="bg-[#FAF6EE] p-4 sm:p-5 rounded-2xl border border-[#D8C7B0] shadow-md flex flex-col gap-4">
      {/* Canvas Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#DECDB8]">
        {/* Tool: Pen vs Eraser */}
        <div className="flex items-center gap-1.5 bg-[#EFE5D5] p-1 rounded-xl border border-[#DAC9AF]">
          <button
            onClick={() => setTool("pen")}
            className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-serif transition-colors ${
              tool === "pen"
                ? "bg-[#38261A] text-[#FAF5ED] font-medium shadow-2xs"
                : "text-[#5C4A3A] hover:bg-[#E5D7BE]"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Pen</span>
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-serif transition-colors ${
              tool === "eraser"
                ? "bg-[#38261A] text-[#FAF5ED] font-medium shadow-2xs"
                : "text-[#5C4A3A] hover:bg-[#E5D7BE]"
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Eraser</span>
          </button>
        </div>

        {/* Brush Sizes */}
        <div className="flex items-center gap-1 bg-[#EFE5D5] p-1 rounded-xl border border-[#DAC9AF]">
          {brushSizes.map((b) => (
            <button
              key={b.size}
              onClick={() => setBrushSize(b.size)}
              className={`px-2.5 py-1.5 min-h-[36px] rounded-lg text-xs font-serif transition-colors ${
                brushSize === b.size
                  ? "bg-[#38261A] text-[#FAF5ED] font-medium"
                  : "text-[#665444] hover:bg-[#E5D7BE]"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Color Palette (Active when tool === "pen") */}
        {tool === "pen" && (
          <div className="flex items-center gap-2 px-1">
            {(Object.keys(inkColorMap) as HandwritingInkColor[]).map((c) => (
              <button
                key={c}
                onClick={() => setInk(c)}
                title={inkColorMap[c].label}
                className={`w-7 h-7 sm:w-6 sm:h-6 rounded-full border border-white/60 transition-transform shadow-2xs ${
                  c === "midnight"
                    ? "bg-[#1B2A3D]"
                    : c === "carbon"
                    ? "bg-[#232120]"
                    : c === "sepia"
                    ? "bg-[#4A3423]"
                    : c === "forest"
                    ? "bg-[#243B28]"
                    : "bg-[#4A1D24]"
                } ${
                  ink === c ? "scale-115 ring-2 ring-[#B89360] ring-offset-1 ring-offset-[#FAF6EE]" : "opacity-80 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        )}

        {/* Clear Canvas Action */}
        <button
          onClick={clearCanvas}
          className="flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-serif text-[#9C5449] hover:bg-[#F3E7E4] border border-transparent hover:border-[#E2C7C4] transition-colors ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Canvas</span>
        </button>
      </div>

      {/* Drawing Pad Canvas Surface */}
      <div className="relative rounded-xl overflow-hidden border border-[#D5C6AC] shadow-inner bg-[#FAF5ED] paper-pattern-lined cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={700}
          height={320}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[220px] sm:h-[260px] touch-none"
        />
        <div className="absolute bottom-2 right-3 text-[10px] font-serif italic text-[#A69382] pointer-events-none">
          Draw sketches, margin doodles, or signatures
        </div>
      </div>

      {/* Actions: Apply sketch or Cancel */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-serif text-[#6B5A4B] hover:bg-[#EFE5D5] transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleApply}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#342419] hover:bg-[#483324] text-[#FAF5ED] text-xs font-medium border border-[#523B2A] shadow-xs active:scale-95 transition-all"
        >
          <Check className="w-3.5 h-3.5 text-[#E5C78B]" />
          <span>Insert Sketch onto Page</span>
        </button>
      </div>
    </div>
  );
}
