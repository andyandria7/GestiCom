import API_BASE_URL from '@/constants/apiConfig';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

type CardPackProps = {
    product_id: number;
    image_url: string;
    pack_name: string;
    product_name: string;
    min_investment: number;
    return_on_investment: number;
    available: number;
    onPress: () => void;
    onPressInvest: () => void;
    role: string;
};

const   CardPack = ({
    image_url,
    available,
    pack_name,
    product_name,
    min_investment,
    return_on_investment,
    onPress,
    onPressInvest,
    role
}: CardPackProps) => {
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri:API_BASE_URL+ image_url }} 
                    style={styles.image} 
                    resizeMode="cover" 
                    onError={(e) => {
                        console.log("Erreur image pour", pack_name, e.nativeEvent);
                    }}/>
                <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>Objectif: {available}</Text>
                </View>
            </View>
            <View style={styles.info}>
                <Text style={styles.packTitle}>{pack_name}</Text>
                <Text style={styles.subtitle}>{product_name}</Text>
                <View style = {styles.priceContainer}>
                    <Text style={styles.price}>{min_investment.toLocaleString('fr-FR')} Ar/Pièce</Text>
                    <Text style={styles.roiText}>{return_on_investment}%</Text>
                </View>
                <View style={styles.footer}>
                    {role === 'commercial' ? (
                        <TouchableOpacity style={styles.commercialButton} onPress={onPress}>
                            <Text style={styles.commercialButtonText}>Voir clients</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.buttons}>
                            <TouchableOpacity style={styles.buttonParticipate} onPress={onPressInvest}>
                                <Text style={styles.buttonText}>Participer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.circle}  onPress={onPress}>
                                <FontAwesomeIcon icon={faPlus} color='#fff'/>
                            </TouchableOpacity>
                        </View>

                    )}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 30,
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        padding: 5,
        marginRight: 10
    },

    imageContainer: {
        backgroundColor: '#EFEFEF',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    image: {
        width: 150,
        height: 150,
    },
    stockBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'green',
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    stockText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
    },
    info: {
        padding: 10,
    },
    packTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    priceContainer:{
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    price: {
        textAlign: 'left',
        fontWeight: '600',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        paddingTop: 10,
    },
    roiText: {
        textAlign: 'right',
        color: '#e74c3c',
        fontWeight: 'bold',
        fontSize: 14,
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: "space-between",
        borderRadius: 25,
        gap: 4,
    },
    buttonParticipate: {
        flex: 1,
        backgroundColor: '#158EFA',
        padding: 10,
        borderRadius: 50,
        textAlign: 'center',
        justifyContent: 'center',
    },
    buttonText:{
        textAlign: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    commercialButton: {
        backgroundColor: '#ee7221',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    commercialButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    circle: {
        height: 39,
        width: 39,
        borderRadius: 50,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CardPack;
