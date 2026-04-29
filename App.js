// App.js — Trident Self-Building GNN App for Expo / React Native
// State lives here; passed down to screens as props.
// The GNN singleton is imported by screens directly.

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { gnn } from './src/engine/TridentGNN';
import BottomNav from './src/components/BottomNav';
import BuilderScreen from './src/screens/BuilderScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import FilesScreen from './src/screens/FilesScreen';
import AgentScreen from './src/screens/AgentScreen';

export default function App() {
  const [activeTab, setActiveTab]   = useState('builder');
  const [gnnReady, setGnnReady]     = useState(false);
  const [gnnStats, setGnnStats]     = useState(null);
  const [gallery, setGallery]       = useState([]);
  const [goals, setGoals]           = useState([]);
  const [pasteFromFiles, setPaste]  = useState(''); // cross-screen paste bridge

  // Load GNN from AsyncStorage on boot
  useEffect(() => {
    gnn.load().then(() => {
      setGnnStats(gnn.getStats());
      setGoals(gnn.goals.map(g => ({ text: g.goal, progress: g.progress || 0, created: g.created })));
      setGnnReady(true);
    });
  }, []);

  const saveToGallery = useCallback((item) => {
    setGallery(prev => [item, ...prev]);
  }, []);

  // When Files sends HTML to Builder, switch tab + populate paste
  const runInBuilder = useCallback((html) => {
    setPaste(html);
    setActiveTab('builder');
  }, []);

  if (!gnnReady) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingIcon}>⬡</Text>
        <Text style={styles.loadingText}>Loading Trident GNN…</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.root} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkText}>⬡</Text>
            </View>
            <View>
              <Text style={styles.logoName}>TRIDENT</Text>
              <Text style={styles.logoSub}>SELF-BUILDING GNN</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.genBadge}>Gen {gnnStats?.generation ?? 0}</Text>
            <View style={styles.dot} />
          </View>
        </View>

        {/* Screen */}
        <View style={styles.screenContainer}>
          {activeTab === 'builder' && (
            <BuilderScreen
              gnnStats={gnnStats}
              onStatsChange={setGnnStats}
              onSaveToGallery={saveToGallery}
              initialPaste={pasteFromFiles}
              onPasteConsumed={() => setPaste('')}
            />
          )}
          {activeTab === 'gallery' && (
            <GalleryScreen gallery={gallery} />
          )}
          {activeTab === 'files' && (
            <FilesScreen onRunInBuilder={runInBuilder} />
          )}
          {activeTab === 'agent' && (
            <AgentScreen
              gnnStats={gnnStats}
              onStatsChange={setGnnStats}
              goals={goals}
              onAddGoal={g => setGoals(prev => [...prev, g])}
              onUpdateGoals={setGoals}
            />
          )}
        </View>

        {/* Bottom nav */}
        <BottomNav activeTab={activeTab} onTabPress={setActiveTab} />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#080810' },

  loading: {
    flex: 1, backgroundColor: '#080810',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  loadingIcon: { fontSize: 52, color: '#5555ff' },
  loadingText: { color: '#555', fontSize: 15 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#5555ff',
    alignItems: 'center', justifyContent: 'center',
  },
  logoMarkText: { fontSize: 18 },
  logoName: {
    fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: -0.3,
  },
  logoSub: {
    fontSize: 9, color: '#555', letterSpacing: 1.5, marginTop: -2,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  genBadge: { color: '#7878ff', fontSize: 12, fontWeight: '700' },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#00c97a',
    shadowColor: '#00c97a',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },

  screenContainer: { flex: 1 },
});
