import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEReponse {
    sigla: string;
    nome: string;
}
interface IBGECityReponse {
    id: number
    nome: string;
}

interface ItemLabelValue {
    label:string;
    value:string;
}


const Home = () => {
    const navigation = useNavigation();
    function handleNavigationToPoints() {
        navigation.navigate('Points', {
         uf: selectedUf,
         city: selectedCity
        });
    }

    const [ufs, setUfs] = useState<ItemLabelValue[]>([]);
    const [selectedUf, setSelectedUf] = useState('');
    const [cities, setCities] = useState<ItemLabelValue[]>([]);
    const [selectedCity, setSelectedCity] = useState(null);

    useEffect(() => {
        axios.get<IBGEReponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            setUfs(response.data.map(uf => {
                 const itemUf: ItemLabelValue = {
                    label: uf.nome,
                    value: uf.sigla
                 };
                return itemUf;
            }));
        })
    }, [])

    useEffect(() => {
        axios.get<IBGECityReponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cities = response.data.map(city => {
                const itemCity: ItemLabelValue = {
                    label: city.nome,
                    value: city.nome
                 };
                return itemCity;
            });
            setCities(cities);
        })
    }, [selectedUf])


    return (
        <ImageBackground
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}>
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}> Seu marketplance de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos a encontrar pontos de coleta de forma eficiente</Text>             
            </View>

            <View style={styles.footer}>
            <RNPickerSelect
                    placeholder={{ label: 'Selecione um estado', value: null,}}
                    onValueChange={(value) => setSelectedUf(value)}
                    items={ufs}
                />

                <RNPickerSelect
                    placeholder={{ label: 'Selecione uma cidade', value: null,}}
                    onValueChange={(value) => setSelectedCity(value)}
                    items={cities}
                />
                <RectButton
                    style={styles.button}
                    onPress={handleNavigationToPoints}
                    enabled={!!selectedCity}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} />
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {      
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});
export default Home;