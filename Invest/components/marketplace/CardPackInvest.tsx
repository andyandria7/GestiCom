import API_BASE_URL from '@/constants/apiConfig';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ProgressBar } from 'react-native-paper';

type CardPackInvestProps = {
  image_url: string;
  pack_name: string;
  product_name: string;
  quantity: number;
  total_amount: number;
  return_on_investment: number;
  created_at: string;
  objective_quantity: number;
  remaining_quantity: number;
  progress_percentage: number;
};

const CardPackInvest = ({
  image_url,
  pack_name,
  product_name,
  quantity,
  total_amount,
  return_on_investment,
  created_at,
  objective_quantity,
  remaining_quantity,
  progress_percentage,
}: CardPackInvestProps) => {
  return (
    <View style={styles.card}>
      <View style = {styles.infoContainer}>
        <Image
          source={{ uri: API_BASE_URL + image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.packName}>{pack_name}</Text>
          <Text style={styles.productName}>{product_name}</Text>

          <View style={styles.progressContainer}>
            <ProgressBar
              progress={progress_percentage / 100}
              color="green"
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {Number(progress_percentage).toFixed(1)}% ({remaining_quantity}/{objective_quantity})
            </Text>
          </View>
          <Text style={styles.dateTime}>Investi le {new Date(created_at).toLocaleDateString('fr-FR')}</Text>
        </View>
      </View>
      <View style={styles.investContainer}>
        <View style={styles.investment}>
          <View style={styles.circleRed}>
            <FontAwesomeIcon icon={faArrowUp} color="#fff" />
          </View>
          <Text style={{ color: 'red' }}>
            {Number(total_amount).toLocaleString('fr-FR')} Ar
          </Text>
        </View>
        <View style={styles.investment}>
          <View style={styles.circleGreen}>
            <FontAwesomeIcon icon={faPlus} color="#fff" />
          </View>
          <Text style={{ color: 'green' }}>
            {Number((total_amount * return_on_investment) / 100).toLocaleString('fr-FR')} Ar
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRightWidth: 5,
    borderColor: 'red',
    marginVertical: 5,
  },
  infoContainer:{
    flexDirection: 'row',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: '#EFEFEF',
  },
  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  packName: {
    fontSize: 20,
    fontWeight: '600',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateTime: {
    color: 'grey',
    fontSize: 12,
  },
  progressContainer: {
    marginTop: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: 'grey',
    marginTop: 2,
  },
  investContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  investment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  circleRed: {
    backgroundColor: 'red',
    borderRadius: 50,
    padding: 3,
  },
  circleGreen: {
    backgroundColor: 'green',
    borderRadius: 50,
    padding: 3,
  },
});

export default CardPackInvest;
