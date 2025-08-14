import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/users';
import { PAGE_SIZE } from '../constants';

export default function UserList() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: ({ signal }) => getUsers({ signal }), // passa AbortSignal p/ cancelar ao desmontar
    retry: 1,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => (!data ? 1 : Math.max(1, Math.ceil(data.length / PAGE_SIZE))),
    [data]
  );
  const pageData = useMemo(
    () => (!data ? [] : data.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE)),
    [data, page]
  );

  const onRefresh = useCallback(() => { refetch(); }, [refetch]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando usuários...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erro ao carregar usuários</Text>
        <Text style={{ marginTop: 6 }}>{String(error?.message ?? '')}</Text>
        <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={refetch} disabled={isFetching}>
          <Text style={styles.buttonText}>{isFetching ? 'Atualizando...' : 'Tentar novamente'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Nenhum usuário encontrado.</Text>
        <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={refetch} disabled={isFetching}>
          <Text style={styles.buttonText}>Recarregar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.button} onPress={refetch} disabled={isFetching}>
          {isFetching ? <ActivityIndicator /> : <Text style={styles.buttonText}>Atualizar</Text>}
        </TouchableOpacity>
        <Text style={styles.info}>Página {page} / {totalPages}</Text>
      </View>

      <FlatList
        data={pageData}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isFetching && !isLoading} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Cidade: {item.address?.city}</Text>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.button, page === 1 && styles.buttonDisabled]}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <Text style={styles.buttonText}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, page === totalPages && styles.buttonDisabled]}
              onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <Text style={styles.buttonText}>Próxima</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', padding: 15, marginVertical: 6, borderRadius: 10, elevation: 2 },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  error: { color: 'red', fontSize: 16, marginBottom: 10 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 10 },
  button: { backgroundColor: '#1f6feb', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '600' },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 12 },
  info: { fontWeight: '500' },
});
