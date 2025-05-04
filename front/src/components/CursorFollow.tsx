import type { ComponentType } from "react"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { useSpring, animated } from "react-spring"

export function withCursorFollow(Component: ComponentType): ComponentType {
    return (props) => {
        const ref = useRef(null)
        const [isHovering, setIsHovering] = useState(false)
        const [isPressed, setIsPressed] = useState(false)
        const [cursorPosition, setCursorPosition] = useState({
            x: -100, // Start off-screen
            y: -100, // Start off-screen
        })
        
        const styles = useSpring({
            transform: `translate3d(${cursorPosition.x - 15}px, ${cursorPosition.y - 15}px, 0) scale(${isPressed ? 0.8 : isHovering ? 1 : 0.5})`,
            opacity: isHovering ? 1 : 0,
            config: { mass: 1, tension: 170, friction: 26 },
        })
        
        useEffect(() => {
            const handleMouseMove = (e) => {
                // Look specifically for our nav buttons
                const navButton = e.target.closest('button')
                if (navButton) {
                    setIsHovering(true)
                    // Get the cursor position relative to the viewport
                    setCursorPosition({
                        x: e.clientX,
                        y: e.clientY,
                    })
                } else {
                    setIsHovering(false)
                }
            }
            
            const handleMouseDown = (e) => {
                const navButton = e.target.closest('button')
                if (navButton) {
                    setIsPressed(true)
                }
            }
            
            const handleMouseUp = () => {
                setIsPressed(false)
            }

            window.addEventListener("mousemove", handleMouseMove)
            window.addEventListener("mousedown", handleMouseDown)
            window.addEventListener("mouseup", handleMouseUp)
            
            return () => {
                window.removeEventListener("mousemove", handleMouseMove)
                window.removeEventListener("mousedown", handleMouseDown)
                window.removeEventListener("mouseup", handleMouseUp)
            }
        }, [])

        return (
            <animated.div
                ref={ref}
                style={{
                    position: "fixed",
                    pointerEvents: "none",
                    left: 0,
                    top: 0,
                    ...styles,
                    transformStyle: "preserve-3d",
                    zIndex: 5,
                }}
            >
                <Component {...props} />
            </animated.div>
        )
    }
}

// Cursor indicator component
export const CursorIndicator = () => (
    <div className="w-6 h-6 bg-primary/30 rounded-full backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/20" />
)

// Create the enhanced cursor component
export const EnhancedCursor = withCursorFollow(CursorIndicator) 