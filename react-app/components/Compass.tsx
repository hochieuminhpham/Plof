import {Animated, Text, View} from "react-native";
import {Styles} from "@/style/style";
import React from "react";

interface CompassProps {
    alpha: string,
    relativeAngle: number,
    targetAngle: string
}

export function Compass({alpha, relativeAngle, targetAngle}:CompassProps){

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Your Angle: {alpha}</Text>

            {/* Der Kompass-Container */}
            <View style={Styles().container}>
                <Animated.View
                    style={[
                        Styles().arrow,
                        { transform: [{ rotate: `${relativeAngle}rad` }] }
                    ]}
                >
                    <View style={Styles().arrowHead} />
                </Animated.View>
            </View>

            <Text>Target's Angle: {targetAngle}</Text>
        </View>
    )
}