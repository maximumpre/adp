"use client"

import { useEffect, useState } from "react"

export function Preloader() {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        
        const timer = setTimeout(() => {
            setVisible(false)
        }, 2000)
        return () => clearTimeout(timer)
    }, [])

    if (!visible) return null

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
            <style jsx>{`
        .spin {
          width: 150px;
          height: 150px;
          position: absolute;
          top: 25%;
          left: 50%;
          margin-left: -75px;
          border: 3px solid transparent;
          border-radius: 50%;
          border-top-color: #035990;
          animation: spin 1500ms infinite linear;
        }

        .spin:before {
          content: "";
          position: absolute;
          top: 3px;
          left: 3px;
          right: 3px;
          bottom: 3px;
          border: 3px solid transparent;
          border-top-color: #035990;
          border-radius: 60%;
          animation: antispin 700ms infinite linear;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        @keyframes antispin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        .preloader-svg {
          width: 100px;
          height: 100px;
          position: absolute;
          top: 25%;
          left: 50%;
          margin-top: 25px;
          margin-left: -50px;
        }
      `}</style>

            <div className="relative w-full h-full">
                <div className="spin"></div>
                <svg
                    version="1.1"
                    className="preloader-svg"
                    viewBox="0 0 179.32 169.39"
                    xmlSpace="preserve"
                    width="100"
                    height="100"
                    style={{
                        width: "100px",
                        height: "100px",
                        position: "absolute",
                        top: "25%",
                        left: "50%",
                        marginTop: "25px",
                        marginLeft: "-50px",
                    }}
                >
                    <defs>
                        <linearGradient
                            id="linear-gradient"
                            y1="73.39"
                            x2="179.32"
                            y2="73.39"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#00558d"></stop>
                            <stop offset="0.26" stopColor="#035990"></stop>
                            <stop offset="0.49" stopColor="#0b649b"></stop>
                            <stop offset="0.72" stopColor="#1976ac"></stop>
                            <stop offset="0.94" stopColor="#2d90c3"></stop>
                            <stop offset="1" stopColor="#3499cc"></stop>
                        </linearGradient>
                        <linearGradient
                            id="linear-gradient-2"
                            x1="17.37"
                            y1="130.54"
                            x2="139.16"
                            y2="130.54"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#00558d"></stop>
                            <stop offset="0.23" stopColor="#025991"></stop>
                            <stop offset="0.44" stopColor="#07649c"></stop>
                            <stop offset="0.65" stopColor="#1076ae"></stop>
                            <stop offset="0.84" stopColor="#1d90c8"></stop>
                            <stop offset="1" stopColor="#2aaae2"></stop>
                        </linearGradient>
                    </defs>
                    <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                            <path
                                className="cls-1"
                                fill="url(#linear-gradient)"
                                d="M3.81,146.28C24.26,48,185.16,134.15,179.16.89a.93.93,0,0,0-1.51-.68C126.91,41.92-21.29,11.2,2.58,146.27A.62.62,0,0,0,3.81,146.28Z"
                            ></path>
                            <path
                                className="cls-2"
                                fill="url(#linear-gradient-2)"
                                d="M19.21,169c16.48-35.8,114.18,5.89,119.95-76.92a.37.37,0,0,0-.57-.34c-34.44,22.51-129.52,5-120.63,77.05A.66.66,0,0,0,19.21,169Z"
                            ></path>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    )
}
