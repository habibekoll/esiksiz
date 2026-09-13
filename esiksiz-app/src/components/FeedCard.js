import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { SpeechService } from '../services/speechService';
import { Volume2, VolumeX, Heart, MessageCircle, Share2, Sparkles, Play, Pause, Bookmark, Subtitles } from 'lucide-react-native';

export const FeedCard = ({ post }) => {
  const { theme, fontSizeScale, bionicReading } = useAccessibility();
  const colors = theme.colors;

  const isVisual = theme.isVisual;
  const isHearing = theme.isHearing;
  const isNeuro = theme.isNeuro;

  // Görme modunda betimleme doğrudan açık başlar
  const [showAiCaption, setShowAiCaption] = useState(isVisual);
  const [isReadingCaption, setIsReadingCaption] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  // Mod değişiminde görme moduna geçilirse otomatik betimlemeyi aç
  useEffect(() => {
    if (isVisual) {
      setShowAiCaption(true);
    }
  }, [isVisual]);

  // Video altyazı akışı
  useEffect(() => {
    let timer;
    if (isPlayingVideo && post.captions && post.captions.length > 0) {
      timer = setInterval(() => {
        setCurrentCaptionIndex((prev) => (prev + 1) % post.captions.length);
      }, 3200);
    }
    return () => clearInterval(timer);
  }, [isPlayingVideo, post.captions]);

  // Görsel Açıklamasını Sesli Oku (TTS)
  const handleToggleSpeakCaption = () => {
    if (isReadingCaption) {
      SpeechService.stop();
      setIsReadingCaption(false);
    } else {
      setShowAiCaption(true);
      setIsReadingCaption(true);
      SpeechService.speak(
        post.aiDescription,
        () => setIsReadingCaption(true),
        () => setIsReadingCaption(false),
        () => setIsReadingCaption(false)
      );
    }
  };

  // Bionic Reading Metin Formatı (Nörogelişimsel Mod İçin)
  const renderFormattedText = (text) => {
    if (!bionicReading) return text;
    const words = text.split(' ');
    return words.map((word, idx) => {
      const mid = Math.ceil(word.length / 2);
      const boldPart = word.slice(0, mid);
      const restPart = word.slice(mid);
      return (
        <Text key={idx}>
          <Text style={{ fontWeight: '800' }}>{boldPart}</Text>
          <Text>{restPart} </Text>
        </Text>
      );
    });
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
          borderWidth: isVisual ? 2.5 : isHearing ? 1.5 : 1,
        },
      ]}
      accessible={true}
      accessibilityRole="article"
      accessibilityLabel={`${post.author.name} gönderisi: ${post.content}`}
    >
      {/* 1. Üst Yazar Bilgisi */}
      <View style={styles.authorRow}>
        <Image
          source={{ uri: post.author.avatar }}
          style={[
            styles.avatar,
            {
              borderColor: isVisual ? '#FFE600' : colors.border,
              borderWidth: isVisual ? 2 : 1,
            },
          ]}
        />
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: colors.text, fontSize: 15 * fontSizeScale }]}>
            {post.author.name}
          </Text>
          <Text style={[styles.authorHandle, { color: colors.textMuted, fontSize: 12 * fontSizeScale }]}>
            {post.author.handle} • {post.timestamp}
          </Text>
        </View>

        {/* İşitme Modu Rozeti */}
        {isHearing && (
          <View style={styles.hearingPill}>
            <Subtitles size={12} color="#0284C7" />
            <Text style={styles.hearingPillText}>Altyazı Aktif</Text>
          </View>
        )}

        {/* Nörogelişimsel Mod Rozeti */}
        {isNeuro && (
          <View style={styles.neuroPill}>
            <Text style={styles.neuroPillText}>Sakin Odak</Text>
          </View>
        )}
      </View>

      {/* 2. Gönderi Metni */}
      <Text
        style={[
          styles.postText,
          {
            color: colors.text,
            fontSize: 15 * fontSizeScale,
            lineHeight: (isVisual ? 24 : 22) * fontSizeScale,
          },
        ]}
      >
        {renderFormattedText(post.content)}
      </Text>

      {/* 3. Görsel ve Yapay Zekâ Betimleme */}
      {post.image && (
        <View style={styles.mediaWrapper}>
          <Image source={{ uri: post.image }} style={styles.mediaImage} />

          {/* Görme modunda değilken açılır-kapanır AI butonu */}
          {!isVisual && (
            <TouchableOpacity
              onPress={() => setShowAiCaption(!showAiCaption)}
              style={[
                styles.aiTriggerBtn,
                {
                  backgroundColor: showAiCaption ? colors.primary : 'rgba(15, 23, 42, 0.85)',
                },
              ]}
              accessible={true}
              accessibilityRole="button"
            >
              <Sparkles size={13} color="#FFFFFF" />
              <Text style={styles.aiTriggerText}>
                {showAiCaption ? 'Gizle' : 'Görseli Açıkla (AI)'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Açık Betimleme Alanı */}
          {showAiCaption && (
            <View
              style={[
                styles.captionBox,
                {
                  backgroundColor: isVisual ? '#000000' : colors.inputBg,
                  borderColor: isVisual ? '#FFE600' : colors.border,
                  borderWidth: isVisual ? 2 : 1,
                },
              ]}
            >
              <View style={styles.captionTopRow}>
                <View style={styles.badgeGroup}>
                  <Sparkles size={14} color={isVisual ? '#FFE600' : colors.primary} />
                  <Text style={[styles.captionBadge, { color: isVisual ? '#FFE600' : colors.primary }]}>
                    Yapay Zekâ Görsel Betimlemesi
                  </Text>
                </View>

                {/* Sesli Dinle Butonu */}
                <TouchableOpacity
                  onPress={handleToggleSpeakCaption}
                  style={[
                    styles.listenBtn,
                    {
                      backgroundColor: isReadingCaption
                        ? '#EF4444'
                        : isVisual
                        ? '#FFE600'
                        : colors.primary,
                      minHeight: isVisual ? 44 : 34,
                    },
                  ]}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Görsel açıklamasını Türkçe seslendir"
                >
                  {isReadingCaption ? (
                    <VolumeX size={15} color={isVisual ? '#000000' : '#FFFFFF'} />
                  ) : (
                    <Volume2 size={15} color={isVisual ? '#000000' : '#FFFFFF'} />
                  )}
                  <Text
                    style={[
                      styles.listenBtnText,
                      {
                        color: isVisual ? '#000000' : '#FFFFFF',
                        fontWeight: '800',
                      },
                    ]}
                  >
                    {isReadingCaption ? 'Durdur' : 'Sesli Dinle'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.captionContent,
                  {
                    color: colors.text,
                    fontSize: 13 * fontSizeScale,
                    lineHeight: 19 * fontSizeScale,
                  },
                ]}
              >
                {renderFormattedText(post.aiDescription)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* 4. Video ve Altyazı */}
      {post.videoUrl && (
        <View style={styles.mediaWrapper}>
          <Image source={{ uri: post.videoPoster }} style={styles.mediaImage} />
          <TouchableOpacity
            onPress={() => setIsPlayingVideo(!isPlayingVideo)}
            style={[
              styles.playBtn,
              { backgroundColor: isVisual ? '#FFE600' : colors.primary },
            ]}
            accessible={true}
            accessibilityRole="button"
          >
            {isPlayingVideo ? (
              <Pause size={24} color={isVisual ? '#000000' : '#FFFFFF'} />
            ) : (
              <Play size={24} color={isVisual ? '#000000' : '#FFFFFF'} />
            )}
          </TouchableOpacity>

          {/* Canlı Altyazı Çubuğu (İşitme modunda her zaman görünür ve belirgindir) */}
          <View
            style={[
              styles.videoSubtitleBar,
              {
                backgroundColor: isVisual ? '#000000' : 'rgba(8, 47, 73, 0.92)',
                borderTopColor: isVisual ? '#FFE600' : '#38BDF8',
                borderTopWidth: isHearing || isVisual ? 2 : 0,
              },
            ]}
          >
            <Text
              style={[
                styles.videoSubtitleText,
                {
                  color: isVisual ? '#FFE600' : '#FFFFFF',
                  fontSize: (isHearing ? 14 : 13) * fontSizeScale,
                },
              ]}
            >
              {post.captions[currentCaptionIndex].text}
            </Text>
          </View>
        </View>
      )}

      {/* 5. Alt Etkileşim Butonları */}
      <View
        style={[
          styles.actionsRow,
          {
            borderTopColor: colors.border,
            borderTopWidth: isVisual ? 2 : 1,
            paddingVertical: isVisual ? 12 : 10,
          },
        ]}
      >
        <View style={styles.leftActions}>
          <TouchableOpacity
            onPress={() => {
              setLiked(!liked);
              setLikeCount(liked ? likeCount - 1 : likeCount + 1);
            }}
            style={[styles.actionItem, { minHeight: isVisual ? 48 : 40 }]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Beğen. ${likeCount} beğeni.`}
          >
            <Heart
              size={20}
              color={liked ? '#EF4444' : isVisual ? '#FFE600' : colors.textMuted}
              fill={liked ? '#EF4444' : 'none'}
            />
            {/* Nörogelişimsel modda dikkat dağıtıcı sayaçları gizleyebilir veya sade tutar */}
            {!theme.hideClutter && (
              <Text style={[styles.actionCount, { color: colors.text, fontSize: 13 * fontSizeScale }]}>
                {likeCount}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionItem, { minHeight: isVisual ? 48 : 40 }]}
            accessible={true}
            accessibilityRole="button"
          >
            <MessageCircle size={20} color={isVisual ? '#FFE600' : colors.textMuted} />
            {!theme.hideClutter && (
              <Text style={[styles.actionCount, { color: colors.text, fontSize: 13 * fontSizeScale }]}>
                {post.comments}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionItem, { minHeight: isVisual ? 48 : 40 }]}
            accessible={true}
            accessibilityRole="button"
          >
            <Share2 size={20} color={isVisual ? '#FFE600' : colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setSaved(!saved)}
          style={[styles.actionItem, { minHeight: isVisual ? 48 : 40 }]}
          accessible={true}
          accessibilityRole="button"
        >
          <Bookmark
            size={20}
            color={saved ? colors.primary : isVisual ? '#FFE600' : colors.textMuted}
            fill={saved ? colors.primary : 'none'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 18,
    overflow: 'hidden',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: '800',
  },
  authorHandle: {
    marginTop: 2,
  },
  hearingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hearingPillText: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: '700',
  },
  neuroPill: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  neuroPillText: {
    color: '#0F766E',
    fontSize: 10,
    fontWeight: '700',
  },
  postText: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  mediaWrapper: {
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: 230,
    resizeMode: 'cover',
  },
  aiTriggerBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  aiTriggerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  captionBox: {
    padding: 14,
    margin: 10,
    borderRadius: 12,
  },
  captionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  captionBadge: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  listenBtnText: {
    fontSize: 12,
  },
  captionContent: {
    lineHeight: 19,
    fontWeight: '500',
  },
  playBtn: {
    position: 'absolute',
    top: '38%',
    left: '42%',
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  videoSubtitleBar: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  videoSubtitleText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minWidth: 44,
  },
  actionCount: {
    fontWeight: '600',
  },
});
