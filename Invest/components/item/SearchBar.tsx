import { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

type SearchBarProps = {
    onSearch: (query: string) => void;
    placeholder?: string;
};

const SearchBar = ({ onSearch, placeholder = 'Rechercher un pack' }: SearchBarProps) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.iconButton} onPress={handleSearch}>
                <FontAwesomeIcon icon={faSearch} size={20} />
            </TouchableOpacity>
            <TextInput
                placeholder={placeholder}
                value={query}
                onChangeText={(text) => {
                    setQuery(text);
                    onSearch(text); // 🔍 Mise à jour automatique à chaque frappe
                }}
                returnKeyType='search'
                style={styles.input}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf:'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: 100,
        backgroundColor: '#ffffff',
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    iconButton: {
        padding: 10,
    },
});

export default SearchBar;
