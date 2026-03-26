import {Animated, Text, View} from "react-native";
import {Styles} from "@/style/style";
import React from "react";

interface CompassProps {
    alpha: string,
    relativeAngle: number,
    targetAngle: string,
    isOverlay: boolean
}

export function Compass({alpha, relativeAngle, targetAngle, isOverlay}:CompassProps){

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {!isOverlay && <Text>Your Angle: {alpha}</Text>}

            {/* Der Kompass-Container */}
            <View style={!isOverlay ? Styles().container : Styles().containerOverlay}>
                <Animated.View
                    style={[
                        !isOverlay ? Styles().arrow : Styles().arrowOverlay,
                        { transform: [{ rotate: `${relativeAngle}rad` }] }
                    ]}
                >
                    <View style={!isOverlay ? Styles().arrowHead : Styles().arrowHeadOverlay} />
                </Animated.View>
            </View>

            {!isOverlay && <Text>Target's Angle: {targetAngle}</Text>}
        </View>
    )
}