import { useEffect, useRef, useState } from "react";

const useThrottleValue = <T>(value: T, delay: number = 100) => {
  const [throttleValue, setThrottleValue] = useState<T>(value);

  const throttling = useRef(Date.now());

  useEffect(() => {
    if (Date.now() - throttling.current >= delay) {
      setTimeout(() => {
        setThrottleValue(value);
        throttling.current = Date.now();
      }, delay);
    }
  }, [value, delay]);

  return throttleValue;
};

export default useThrottleValue;
