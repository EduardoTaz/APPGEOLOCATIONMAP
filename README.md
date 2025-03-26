# 🗺️ Mapa com Rotas - React Native & Expo

> Aplicativo móvel para visualização de mapas, localização em tempo real e cálculo de rotas entre pontos
> 
## 🌟 Visão Geral

Aplicativo desenvolvido com React Native e Expo que permite:

- Visualizar mapa interativo
- Obter localização atual do usuário
- Buscar endereços e lugares
- Calcular rotas entre dois pontos
- Visualizar distância e tempo estimado

## ✨ Funcionalidades

### Mapa Interativo
- Visualização de mapa com `react-native-maps`
- Toque para selecionar pontos
- Ajuste automático de zoom

### Localização
- GPS de alta precisão
- Atualização em tempo real
- Marcador de posição

### Rotas
- Cálculo usando OSRM API
- Visualização com Polyline
- Exibição de distância e duração

### Busca
- Geocodificação com Nominatim
- Conversão endereço → coordenadas
- Sugestões de lugares

## 🛠️ Pré-requisitos

- Node.js 
- NPM
- Expo
- Dispositivo móvel com Expo Go ou emulador

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/EduardoTaz/APPGEOLOCATIONMAP.git

# Acesse a pasta
cd APPGEOLOCATIONMAP

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
