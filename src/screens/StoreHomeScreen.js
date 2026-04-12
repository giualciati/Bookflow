import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, FlatList, ActivityIndicator, Image, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { getAllLivros, getAllCategorias } from '../services/database';
import BottomNavBar from '../components/BottomNavBar';

// ─── Styled Components ────────────────────────────────────────────────────────

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const HeaderGroup = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-top: 8px;
`;

const HamburgerBtn = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  justify-content: center;
`;

const HeaderRightGroup = styled.View`
  flex-direction: row;
  background-color: ${theme.colors.secondary};
  border-radius: 20px;
  padding: 4px 12px;
  align-items: center;
`;

const HeaderIconBtn = styled.TouchableOpacity`
  padding: 8px;
`;

const Greeting = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin-left: 16px;
  margin-bottom: 16px;
`;

const BannerScroll = styled.ScrollView`
  padding-left: 16px;
  margin-bottom: 24px;
`;

const BannerCard = styled.View`
  width: 280px;
  height: 140px;
  border-radius: 12px;
  margin-right: 16px;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const BannerBgTeal = styled(BannerCard)`
  background-color: ${theme.colors.accent};
  padding: 16px;
  align-items:flex-end;
`;

const BannerBgBlack = styled(BannerCard)`
  background-color: #000;
  padding: 16px;
`;

const BannerTitle = styled.Text`
  color: #fff;
  font-size: 28px;
  font-weight: 900;
  line-height: 32px;
  text-align: right;
`;

// Categorias e Livros
const SectionTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${theme.colors.textSecondary};
  margin-left: 16px;
  margin-bottom: 12px;
`;

const BooksScroll = styled.FlatList`
  padding-left: 16px;
  margin-bottom: 24px;
`;

const BookCoverButton = styled.TouchableOpacity`
  margin-right: 12px;
  width: 120px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${theme.colors.inputBg};
  justify-content: center;
  align-items: center;
`;

const BookCoverImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const FallbackTitle = styled.Text`
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  padding: 8px;
  color: ${theme.colors.text};
`;

// Mock para quando DB estiver vazio
const MOCK_BOOKS = [
  { id: 1, titulo: 'A Hipótese do Amor', categoria: 'Romance', preco: 49.90 },
  { id: 2, titulo: 'Jane Eyre', categoria: 'Romance', preco: 34.90 },
  { id: 3, titulo: 'Nós Já Moramos Aqui', categoria: 'Suspense', preco: 45.00 },
  { id: 4, titulo: 'A Paciente Silenciosa', categoria: 'Suspense', preco: 55.00 },
  { id: 5, titulo: 'O Poder do Hábito', categoria: 'Autoajuda', preco: 39.90 },
  { id: 6, titulo: 'Um Livro de Auto-ajuda', categoria: 'Autoajuda', preco: 29.90 },
];

export default function StoreHomeScreen({ navigation }) {
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const books = await getAllLivros();
      setAllBooks(books.length > 0 ? books : MOCK_BOOKS);
    } catch (_) {
      setAllBooks(MOCK_BOOKS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const getBooksByCategory = (catName) => {
    return allBooks.filter(b => b.categoria && b.categoria.toLowerCase() === catName.toLowerCase());
  };

  const romanceBooks = getBooksByCategory('Romance');
  const suspenseBooks = getBooksByCategory('Suspense');
  const autoAjudaBooks = getBooksByCategory('Autoajuda');

  const renderBookGroup = (title, data) => {
    if (data.length === 0) return null;
    return (
      <View>
        <SectionTitle>{title}</SectionTitle>
        <BooksScroll
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingRight: 16 }}
          renderItem={({ item }) => (
            <BookCoverButton
              onPress={() => {
                // Ao invés de comprar direto, talvez ir para detalhes ou confirmar,
                // mantendo o fluxo existente do StoreHomeScreen anterior:
                navigation.navigate('OrderConfirmation', {
                  itens: [{ livro_id: item.id, titulo: item.titulo, quantidade: 1, preco_unitario: item.preco }],
                });
              }}
            >
              {item.imagem_url ? (
                <BookCoverImage source={{ uri: item.imagem_url }} resizeMode="cover" />
              ) : (
                <FallbackTitle>{item.titulo}</FallbackTitle>
              )}
            </BookCoverButton>
          )}
        />
      </View>
    );
  };

  return (
    <Screen>
      <HeaderGroup>
        <HamburgerBtn>
          <Ionicons name="menu" size={28} color={theme.colors.textSecondary} />
        </HamburgerBtn>

        <HeaderRightGroup>
          <HeaderIconBtn onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={20} color={theme.colors.white} />
          </HeaderIconBtn>
          <HeaderIconBtn>
            <Ionicons name="bag-handle-outline" size={20} color={theme.colors.white} />
          </HeaderIconBtn>
        </HeaderRightGroup>
      </HeaderGroup>

      <Content showsVerticalScrollIndicator={false}>
        <Greeting>Olá, Usuário!</Greeting>

        <BannerScroll horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
          <BannerBgTeal>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <BannerTitle>Não</BannerTitle>
              <BannerTitle>Ficção</BannerTitle>
            </View>
          </BannerBgTeal>
          <BannerBgBlack>
            {/* Placeholder para a segunda imagem do banner */}
          </BannerBgBlack>
        </BannerScroll>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.secondary} style={{ marginTop: 40 }} />
        ) : (
          <View>
            {renderBookGroup('Romance', romanceBooks.length > 0 ? romanceBooks : MOCK_BOOKS.filter(b => b.categoria === 'Romance'))}
            {renderBookGroup('Suspense', suspenseBooks.length > 0 ? suspenseBooks : MOCK_BOOKS.filter(b => b.categoria === 'Suspense'))}
            {renderBookGroup('Autoajuda', autoAjudaBooks.length > 0 ? autoAjudaBooks : MOCK_BOOKS.filter(b => b.categoria === 'Autoajuda'))}
          </View>
        )}
      </Content>

      <BottomNavBar active="home" navigation={navigation} />
    </Screen>
  );
}
