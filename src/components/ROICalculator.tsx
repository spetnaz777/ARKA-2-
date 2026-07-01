import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, TrendingUp, Clock, DollarSign, Users, Zap, CheckCircle2 } from "lucide-react";

interface ROICalculatorProps {
  theme: "black" | "slate" | "summit";
  addLog: (log: string) => void;
  onBookCall?: () => void;
}

function useAnimatedNumber(target: number, duration = 800) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const fromRef = useRef<number>(0);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(fromRef.current + (target - fromRef.current) * ease));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return display;
}

export const ROICalculator: React.FC<ROICalculatorProps> = ({ addLog, onBookCall }) => {
  const [teamSize, setTeamSize] = useState(5);
  const [manualHours, setManualHours] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(45);
  const [monthlyLeads, setMonthlyLeads] = useState(150);
  const [responseTime, setResponseTime] = useState(240);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Core calculations
  const automationRate = 0.82;
  const hoursReclaimed = Math.round(teamSize * manualHours * 4.33 * automationRate);
  const costSavedMonthly = Math.round(hoursReclaimed * hourlyRate);
  const costSavedYearly = costSavedMonthly * 12;
  const leadConversionLift = Math.min(0.65, (responseTime / 5) * 0.04);
  const leadsRecovered = Math.round(monthlyLeads * leadConversionLift);
  const assumedLeadValue = hourlyRate * 8;
  const leadRevenueMonthly = leadsRecovered * assumedLeadValue;
  const totalMonthlyGain = costSavedMonthly + leadRevenueMonthly;
  const arkaMonthlyFee = 950;
  const roiMultiplier = Math.max(1, Math.round((totalMonthlyGain / arkaMonthlyFee) * 10) / 10);
  const paybackDays = Math.round((arkaMonthlyFee / totalMonthlyGain) * 30);

  const animHours = useAnimatedNumber(hoursReclaimed);
  const animMonthlyCost = useAnimatedNumber(costSavedMonthly);
  const animYearlyCost = useAnimatedNumber(costSavedYearly);
  const animLeads = useAnimatedNumber(leadsRecovered);
  const animROI = useAnimatedNumber(roiMultiplier * 10);
  const animPayback = useAnimatedNumber(paybackDays);

  const handleSliderChange = (setter: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(Number(e.target.value));
    if (!hasInteracted) {
      setHasInteracted(true);
      addLog("[ROI] Live automation ROI calculation initialised from user inputs.");
    }
  };

  const automatedTasks = [
    { label: "Lead follow-up & nurturing", hours: Math.round(teamSize * 3.5 * automationRate) },
    { label: "Appointment scheduling", hours: Math.round(teamSize * 2.2 * automationRate) },
    { label: "CRM data entry & sync", hours: Math.round(teamSize * 2.8 * automationRate) },
    { label: "Report generation", hours: Math.round(teamSize * 1.8 * automationRate) },
    { label: "Email & outreach sequences", hours: Math.round(teamSize * 2.5 * automationRate) },
    { label: "Invoice & billing workflows", hours: Math.round(teamSize * 2.2 * automationRate) },
  ];

  return (
    <div className="flex flex-col gap-6 pb-16 text-white">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-michroma tracking-[0.2em] uppercase text-white/25">Intelligence Engine</span>
        <h2 className="font-sans font-light text-[2rem] md:text-[2.6rem] tracking-[0.04em] uppercase text-white leading-[1.05]">
          AI ROI Calculator
        </h2>
        <p className="text-[13px] font-light text-white/40 leading-relaxed max-w-lg tracking-wide">
          Input your team's numbers. See exactly what AI automation saves you — in hours, dollars, and leads — before you commit to anything.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT — Inputs */}
        <div className="lg:col-span-5 flex flex-col gap-4">

          {/* Slider block */}
          <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-[2rem] flex flex-col gap-6">
            <span className="font-michroma text-[9px] tracking-[0.2em] uppercase text-white/30">Your Current Setup</span>

            {[
              {
                label: "Team Members",
                value: teamSize,
                min: 1, max: 50, step: 1,
                display: `${teamSize} people`,
                setter: (v: number) => setTeamSize(v),
              },
              {
                label: "Manual Hours / Person / Week",
                value: manualHours,
                min: 1, max: 40, step: 1,
                display: `${manualHours} hrs / wk`,
                setter: (v: number) => setManualHours(v),
              },
              {
                label: "Average Hourly Cost",
                value: hourlyRate,
                min: 15, max: 200, step: 5,
                display: `$${hourlyRate} / hr`,
                setter: (v: number) => setHourlyRate(v),
              },
              {
                label: "Monthly Inbound Leads",
                value: monthlyLeads,
                min: 10, max: 1000, step: 10,
                display: `${monthlyLeads} leads`,
                setter: (v: number) => setMonthlyLeads(v),
              },
              {
                label: "Avg Lead Response Time",
                value: responseTime,
                min: 1, max: 480, step: 5,
                display: responseTime >= 60 ? `${Math.floor(responseTime / 60)}h ${responseTime % 60}m` : `${responseTime} min`,
                setter: (v: number) => setResponseTime(v),
              },
            ].map(({ label, value, min, max, step, display, setter }) => (
              <div key={label} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-michroma text-[9px] tracking-[0.14em] uppercase text-white/40">{label}</span>
                  <span className="font-michroma text-[11px] text-white/80">{display}</span>
                </div>
                <input
                  type="range"
                  min={min} max={max} step={step} value={value}
                  onChange={handleSliderChange(setter)}
                  className="w-full h-[3px] bg-white/10 appearance-none rounded-full cursor-pointer accent-white"
                />
              </div>
            ))}
          </div>

          {/* What gets automated */}
          <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-[2rem] flex flex-col gap-4">
            <span className="font-michroma text-[9px] tracking-[0.2em] uppercase text-white/30">Tasks Automated Monthly</span>
            <div className="flex flex-col gap-2.5">
              {automatedTasks.map(({ label, hours }) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-3 h-3 text-white/20 shrink-0" />
                    <span className="text-[11px] text-white/45 font-light truncate">{label}</span>
                  </div>
                  <span className="font-michroma text-[10px] text-white/60 shrink-0">{hours}h</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT — Live Output */}
        <div className="lg:col-span-7 flex flex-col gap-4">

          {/* Hero metric */}
          <motion.div
            key={costSavedYearly}
            className="p-7 bg-white/[0.03] border border-white/[0.08] rounded-[2rem] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
            <div className="flex flex-col gap-1 relative z-10">
              <span className="font-michroma text-[9px] tracking-[0.2em] uppercase text-white/30">Estimated Annual Savings</span>
              <div className="flex items-end gap-2 mt-1">
                <span className="font-sans font-light text-white" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1 }}>
                  ${animYearlyCost.toLocaleString()}
                </span>
                <span className="font-michroma text-[10px] text-white/30 pb-2 tracking-widest">/ YEAR</span>
              </div>
              <p className="text-[11px] text-white/35 font-light mt-2 leading-relaxed">
                In recovered labour hours alone — not counting the leads and revenue your team wasn't fast enough to close.
              </p>
            </div>
          </motion.div>

          {/* Secondary metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: <Clock className="w-4 h-4" />,
                label: "Hours Reclaimed / Mo",
                value: `${animHours.toLocaleString()}`,
                sub: `${Math.round(animHours / teamSize)} per person`,
              },
              {
                icon: <DollarSign className="w-4 h-4" />,
                label: "Cost Saved / Month",
                value: `$${animMonthlyCost.toLocaleString()}`,
                sub: "in billable labour",
              },
              {
                icon: <Users className="w-4 h-4" />,
                label: "Leads Recovered / Mo",
                value: `+${animLeads}`,
                sub: "from faster response",
              },
              {
                icon: <TrendingUp className="w-4 h-4" />,
                label: "ROI vs ARKA Fee",
                value: `${(animROI / 10).toFixed(1)}×`,
                sub: `${animPayback}d payback period`,
              },
            ].map(({ icon, label, value, sub }) => (
              <div key={label} className="p-5 bg-white/[0.02] border border-white/[0.05] rounded-[1.5rem] flex flex-col gap-3">
                <div className="text-white/25">{icon}</div>
                <div>
                  <div className="font-michroma text-[9px] tracking-[0.14em] uppercase text-white/30 mb-1">{label}</div>
                  <div className="font-sans font-light text-2xl text-white leading-none">{value}</div>
                  <div className="font-michroma text-[9px] text-white/25 mt-1.5 tracking-wider">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Savings bar — before vs after */}
          <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] flex flex-col gap-4">
            <span className="font-michroma text-[9px] tracking-[0.2em] uppercase text-white/30">Before vs After Automation</span>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="font-michroma text-[9px] uppercase text-white/30 tracking-wider">Without ARKA</span>
                  <span className="font-michroma text-[10px] text-white/40">${(teamSize * manualHours * 4.33 * hourlyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} / mo</span>
                </div>
                <div className="h-[5px] bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-white/20 rounded-full w-full" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="font-michroma text-[9px] uppercase text-white/30 tracking-wider">With ARKA</span>
                  <span className="font-michroma text-[10px] text-white/80">${Math.round(teamSize * manualHours * 4.33 * hourlyRate * (1 - automationRate) + arkaMonthlyFee).toLocaleString()} / mo</span>
                </div>
                <div className="h-[5px] bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    animate={{ width: `${(1 - automationRate) * 100 + 5}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Zap className="w-3 h-3 text-white/30 shrink-0" />
              <span className="text-[11px] text-white/35 font-light leading-relaxed">
                These estimates use conservative industry benchmarks. Real savings are typically higher once full pipelines are mapped.
              </span>
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              addLog(`[ROI] User requested call after seeing $${costSavedYearly.toLocaleString()}/yr savings estimate.`);
              onBookCall?.();
            }}
            className="w-full py-5 rounded-[1.5rem] bg-white text-black font-michroma text-[9px] tracking-[0.22em] uppercase cursor-pointer flex items-center justify-center gap-3 transition-all hover:bg-neutral-100 shadow-[0_0_24px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.25)]"
          >
            Unlock ${costSavedYearly.toLocaleString()} in savings — book a free call
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>

        </div>
      </div>
    </div>
  );
};
