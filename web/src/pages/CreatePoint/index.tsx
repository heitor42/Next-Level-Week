import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';

import logo from '../../assets/logo.svg';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    id: number;
    sigla: string;
    nome: string;
}

interface IBGECityResponse {
    id: number;
    nome: string;
}

const CreatPoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',

    })

    const [selectedUf, setSelectedUf] = useState<string>('0');
    const [selectedCity, setSelectedCity] = useState<string>('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [citys, setCitys] = useState<string[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    
    const history = useHistory();

    useEffect(() => {
        setInitialPosition([-15.721387, -48.0774416]);
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            
            setInitialPosition([latitude, longitude]);
        })
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)
            setUfs(ufInitials)
        })
    }, []);

    useEffect (() => {
        // carregar as cidades semre que as uf mudarem
        if (selectedUf === '0') {
            return;
        }

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const citys = response.data.map(city => city.nome)

                setCitys(citys)
        })
    }, [selectedUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat, 
            event.latlng.lng
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        // é preciso manter os dados que ja tem
        const {name, value} = event.target;
        setFormData({...formData, [name]: value})
    }

    function handleSelectItem(id: number) {
        const alrearySelected = selectedItems.findIndex(item => item === id);

        if (alrearySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([ ...selectedItems, id]);
        }

    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        
        const {name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const items = selectedItems;
        const [ longitude, latitude ] = selectedPosition;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            longitude,
            latitude,
            items
        }

        api.post('/points', data);

        alert('ponto de coleta criado!');

        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecolata" />

                <Link to='/'><FiArrowLeft />Voltar para home</Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br />poonto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="email">email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="whatsapp">WhatsApp</label>
                                <input
                                    type="text"
                                    name="whatsapp"
                                    id="whastsapp"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereços</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={5} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">
                                <select 
                                    name="uf" 
                                    id="uf" 
                                    onChange={handleSelectUf}
                                >
                                    <option value="0">Selecione uma UF</option>
                                    {ufs.map(uf => (
                                        <option value={uf} key={uf}>{uf}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="city">
                                <select 
                                    name="city" 
                                    id="city" 
                                    onChange={handleSelectCity}
                                >
                                    <option value="0">Selecione uma city</option>
                                    {citys.map(city => (
                                        <option value={city} key={city}>{city}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecioneum ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                            <img src={item.image_url} alt={item.title} />
                            <span>{item.title}</span>
                        </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
}

export default CreatPoint;