"use client"
import { FC, memo, useCallback, useMemo, useRef, useState } from 'react';

interface CounterProps {
    interval?: number;
}

const Counter: FC<CounterProps> = ({ interval = 1 }) => {
    const step = useMemo(() => interval ?? 1, [interval]);
    const [count, setCount] = useState(0);
    const [flag, setFlag] = useState(false);
    const clickCountRef = useRef(0);

    const manageClickCount = useCallback(() => {
        clickCountRef.current += 1;
        if (clickCountRef.current > 9) setFlag(true);
    }, []);

    const inc = useCallback(() => {
        setCount((prev) => prev + step);
        manageClickCount();
    }, [manageClickCount, step]);

    const dec = useCallback(() => {
        setCount((prev) => prev - step);
        manageClickCount();
    }, [manageClickCount, step]);

    const reset = useCallback(() => {
        clickCountRef.current = 0;
        setCount(0);
        setFlag(false);
    }, []);

    return (
        <div className="w-full max-w-lg mx-auto p-6">
            <div className="rounded-2xl shadow-lg border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Counter
                    </h3>
                    <span
                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 px-3 py-1 text-xs font-medium"
                        title="Increment/Decrement step"
                    >
                        Step: {step}
                    </span>
                </div>

                <div className="px-6 pb-2">
                    <div className="relative">
                        <input
                            type="text"
                            value={count}
                            readOnly
                            aria-label="Current count"
                            className="w-full text-center text-4xl font-bold tracking-tight bg-transparent rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-200/70 dark:focus:ring-blue-900/50 transition"
                        />
                        <div className="absolute -top-2 right-2 text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Value
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6">
                    <CounterControls flag={flag} inc={inc} dec={dec} reset={reset} />
                </div>
            </div>
        </div>
    );
}

interface CounterControlsProps {
    flag: boolean;
    inc: () => void;
    dec: () => void;
    reset: () => void;
}

const CounterControls: FC<CounterControlsProps> = memo(({ flag, inc, dec, reset }) => {
    console.log("CounterControls Rendered");

    const baseBtn =
        "inline-flex items-center justify-center w-28 h-12 rounded-xl text-lg font-semibold transition " +
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 " +
        "disabled:opacity-50 disabled:cursor-not-allowed ring-offset-white dark:ring-offset-gray-900";

    const primary =
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-800";
    const ghost =
        "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 " +
        "focus-visible:ring-gray-300 dark:focus-visible:ring-gray-700";
    const warn =
        "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-300 dark:focus-visible:ring-amber-800";

    return (
        <div className="flex flex-wrap gap-3 justify-center">
            <button
                type="button"
                aria-label="Increment"
                className={`${baseBtn} ${primary}`}
                disabled={flag}
                onClick={inc}
            >
                +
            </button>

            <button
                type="button"
                aria-label="Decrement"
                className={`${baseBtn} ${ghost}`}
                disabled={flag}
                onClick={dec}
            >
                −
            </button>

            <button
                type="button"
                aria-label="Reset counter"
                title={flag ? "Reset counter" : "Activate after 10 actions"}
                className={`${baseBtn} ${warn}`}
                disabled={!flag}
                onClick={reset}
            >
                Reset
            </button>
        </div>
    );
});

const CounterAssignment: FC = () => {
    return (
        <div className="min-h-[60vh] bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-10">
            <div className="space-y-10">
                <Counter />
                <Counter interval={10} />
            </div>
        </div>
    );
};

export default CounterAssignment;