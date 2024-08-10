import React, { useState, useRef, useEffect } from 'react';

interface SecondsDialProps {
    value: number;
    setSeconds: any;

}

const SecondsDial: React.FC<SecondsDialProps> = ({ value, setSeconds }) => {
    const [isDragging, setIsDragging] = useState(false);
    const dialRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging || !dialRef.current) return;

        const dialRect = dialRef.current.getBoundingClientRect();
        const dialCenterX = dialRect.left + dialRect.width / 2;
        const dialCenterY = dialRect.top + dialRect.height / 2;
        const angle = Math.atan2(event.clientY - dialCenterY, event.clientX - dialCenterX);
        let newValue = Math.round((angle / (2 * Math.PI)) * 3600);

        if (newValue < 0) {
            newValue += 3600;
        } else if (newValue > 3600) {
            newValue -= 3600;
        }
        setSeconds(newValue);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div
            ref={dialRef}
            style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                position: 'relative',
                cursor: 'pointer',
            }}
            onMouseDown={handleMouseDown}
        >
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${(value / 3600) * 360}deg)`,
                    width: '4px',
                    height: '80px',
                    backgroundColor: '#000',
                }}
            />
        </div>
    );
};

export default SecondsDial;