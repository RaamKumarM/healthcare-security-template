"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Rocket } from "lucide-react";

/**
 * HIPAA posture donut + promo banner (reference: Professional Status card).
 * @param {{ score: number, coverage: number }} props
 */
export default function ScoreDonut({ score, coverage }) {
  const outer = [
    { name: "covered", value: coverage },
    { name: "rest", value: 100 - coverage },
  ];
  const inner = [
    { name: "score", value: score },
    { name: "rest", value: 100 - score },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
        <h3 className="text-[14px] font-bold text-slate-800">HIPAA Posture</h3>
        <div className="relative mx-auto h-44 w-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={outer} dataKey="value" innerRadius={62} outerRadius={72} startAngle={90} endAngle={-270} strokeWidth={0}>
                <Cell fill="#3730a3" />
                <Cell fill="#ede9fe" />
              </Pie>
              <Pie data={inner} dataKey="value" innerRadius={46} outerRadius={56} startAngle={90} endAngle={-270} strokeWidth={0}>
                <Cell fill="#22c55e" />
                <Cell fill="#dcfce7" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-800">
            {score}%
          </span>
        </div>
        <div className="flex justify-between text-[12px] text-slate-500">
          <span>
            Coverage <span className="font-bold text-slate-800">{coverage}%</span>
          </span>
          <span>
            Controls <span className="font-bold text-slate-800">132 / 143</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-2xl bg-orange-100/70 p-4 text-[13px] text-orange-800">
        <Rocket size={18} className="shrink-0" />
        You&apos;ll get new compliance template offers
      </div>
    </div>
  );
}
