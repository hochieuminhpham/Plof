import {StyleSheet} from 'react-native'
import React from 'react'

const style = () => {
    return StyleSheet.create({
        container: {
            width: 200,
            height: 200,
            borderRadius: 100,
            borderWidth: 4,
            borderColor: '#2D6A4F', // Dunkles Smaragdgrün
            backgroundColor: '#F0F9F4', // Ganz helles Mint-Weiß
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 40,
            // Subtiler Schatten für Tiefe
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
        },
        containerOverlay: {
            width: 30,
            height: 30,
            borderRadius: 100,
            borderWidth: 4,
            borderColor: '#2D6A4F', // Dunkles Smaragdgrün
            backgroundColor: '#F0F9F4', // Ganz helles Mint-Weiß
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 40,
            // Subtiler Schatten für Tiefe
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5,
            marginLeft: 10
        },
        arrow: {
            width: 4,
            height: 120, // Länger für bessere Sichtbarkeit
            backgroundColor: '#4CBB17', // Kelly Green für den Zeiger
            alignItems: 'center',
            borderRadius: 2,
        },
        arrowHead: {
            width: 20,
            height: 20,
            borderTopWidth: 4,
            borderRightWidth: 4,
            borderColor: '#4CBB17',
            transform: [{ rotate: '-45deg' }],
            marginTop: -2, // Den Kopf bündig auf den Schaft setzen
        },
        arrowOverlay: {
            width: 4,
            height: 40, // Länger für bessere Sichtbarkeit
            backgroundColor: '#4CBB17', // Kelly Green für den Zeiger
            alignItems: 'center',
            borderRadius: 2,
        },
        arrowHeadOverlay: {
            width: 10,
            height: 10,
            borderTopWidth: 4,
            borderRightWidth: 4,
            borderColor: '#4CBB17',
            transform: [{ rotate: '-45deg' }],
            marginTop: -2, // Den Kopf bündig auf den Schaft setzen
        },
        infoText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#555',
            fontFamily: 'monospace', // Technischer Look für Koordinaten
        }
    })
}

export function Styles(){
    return style();
}