import { faUpload, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SoldeProps = {
    balance: number;
    color?: string; 
    onWithdrawPress?: () => void;
}

const Solde = ({ balance = 0, color = "#158EFA", onWithdrawPress }: SoldeProps) => {
    const solde = balance.toLocaleString('fr-FR');
    
    return (
        <View style={[styles.container, { borderColor: color, backgroundColor: `${color}20` }]}>
            <FontAwesomeIcon style={styles.iconImage} icon={faWallet} size={25} color={color} />
            <View style={styles.soldeContainer}>
                <Text style={[styles.soldeText, { color }]}>Solde disponible</Text>
                <Text style={[styles.solde, { color }]}>{solde || 0} Ar</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
    },
    iconImage: {
        margin: 10,
    },
    soldeContainer: {
        flexDirection: 'column',
        flex: 1,
        marginLeft: 10,
    },
    soldeText: {
        fontSize: 14,
    },
    solde: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    withdrawButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    withdrawButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    }
})

export default Solde;
