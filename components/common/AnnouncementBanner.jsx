"use client";
import React from "react";
import styles from "./AnnouncementBanner.module.scss";
import { bannerConfig } from "./bannerConfig";

export default function AnnouncementBanner({
    messages = bannerConfig.messages,
    backgroundColor = bannerConfig.backgroundColor,
    textColor = bannerConfig.textColor,
    speed = bannerConfig.speed,
    pauseOnHover = bannerConfig.pauseOnHover
}) {
    // Don't render if banner is disabled in config
    if (!bannerConfig.enabled) {
        return null;
    }

    return (
        <div
            className={styles.announcementBanner}
            style={{ backgroundColor }}
        >
            <div className={styles.bannerContent}>
                <div
                    className={`${styles.scrollingText} ${pauseOnHover ? styles.pauseOnHover : ''}`}
                    style={{
                        color: textColor,
                        animationDuration: `${speed}s`
                    }}
                >
                    {/* Duplicate messages for seamless loop */}
                    {[...messages, ...messages, ...messages].map((message, index) => (
                        <span key={index} className={styles.message}>
                            {message}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
