import { useEffect, useState } from "react";

const useDebounce = (searchStr, delay) => {

    const [debouncedValue, setDebouncedValue] = useState("");

    useEffect(() => {

        const timer = setTimeout(() => {
            setDebouncedValue(searchStr);
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [searchStr, delay])

    return debouncedValue;
}

export default useDebounce;