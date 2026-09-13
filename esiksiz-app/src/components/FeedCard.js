import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { SpeechService } from '../services/speechService';
import { Volume2, VolumeX, Heart, MessageCircle, Share2, Sparkles, Play, Pause, Bookmark, Ear, Music, UserCheck } from 'lucide-react-native';

export const FeedCard = ({ post }) => {
  const { theme, fontSizeScale, bionicReading, tidActive, focusRulerActive } = useAccessibility();
  const colors = theme.colors;

  const isVisual = theme.isVisual;
  const isHearing = theme.isHearing;
  const isNeuro = theme.isNeuro;
  const isMotor = theme.isMotor;

  const [isReadingPost, setIsReadingPost] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  // Video altyazı akışı
  useEffect(() => {
    let timer;
    if (isPlayingVideo && post.captions && post.captions.length > 0) {
      timer = setInterval(() => {
        setCurrentCaptionIndex((prev) => (prev + 1) % post.captions.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlayingVideo, post.captions]);

  // GÖRME ENGELLİ KULLANICI İÇİN: Karta dokununca hem yazıyı hem görseli seslendirme!
  const handleToggleReadPostAndImage = () => {
    if (isReadingPost) {
      SpeechService.stop();
      setIsReadingPost(false);
    } else {
      setIsReadingPost(true);
      let fullSpeech = `${post.author.name} paylaştı: ${post.content}. `;
      if (post.image && post.aiDescription) {
        fullSpeech += `Paylaşılan görselin betimlemesi: ${post.aiDescription}`;
      } else if (post.videoUrl) {
        fullSpeech += `Paylaşılan videonun betimlemesi: ${post.aiDescription || 'Videoda klavyede hızlıca kod yazan eller yakın plandan gösteriliyor.'}`;
      }

      SpeechService.speak(
        fullSpeech,
        () => setIsReadingPost(true),
        () => setIsReadingPost(false),
        () => setIsReadingPost(false)
      );
    }
  };

  // Bionic Reading Metin Formatı (DEHB ve Hızlı Odaklanma)
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
          borderColor: isVisual ? '#FFE600' : isHearing ? '#0284C7' : isMotor ? '#7C3AED' : colors.cardBorder,
          borderWidth: isVisual ? 2.5 : isHearing || isMotor ? 2 : 1,
        },
      ]}
      accessible={true}
      accessibilityRole="article"
      accessibilityLabel={`${post.author.name} gönderisi: ${post.content}`}
    >
      {/* 1. GÖRME MODUNDA: KARTIN EN ÜSTÜNDE DEVA SA SESLİ DİNLEME BANNERI */}
      {isVisual && (
        <TouchableOpacity
          onPress={handleToggleReadPostAndImage}
          activeOpacity={0.8}
          style={[
            styles.voiceBanner,
            { backgroundColor: isReadingPost ? '#DC2626' : '#FFE600' },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isReadingPost ? 'Okumayı durdur' : 'Gönderiyi ve görseli sesli dinle'}
        >
          {isReadingPost ? (
            <VolumeX size={20} color="#FFFFFF" />
          ) : (
            <Volume2 size={20} color="#000000" />
          )}
          <Text style={[styles.voiceBannerText, { color: isReadingPost ? '#FFFFFF' : '#000000' }]}>
            {isReadingPost ? 'Okuma Sürüyor (Durdurmak İçin Dokunun) ⏹️' : '🔊 Gönderiyi ve Görseli Dinlemek İçin Dokunun'}
          </Text>
        </TouchableOpacity>
      )}

      {/* KART GÖVDESİ - Görme modunda herhangi bir yere dokunulunca da okur */}
      <TouchableOpacity
        onPress={isVisual ? handleToggleReadPostAndImage : undefined}
        activeOpacity={isVisual ? 0.85 : 1}
      >
        {/* Kullanıcı Başlığı */}
        <View style={styles.authorRow}>
          <Image
            source={{ uri: post.author.avatar }}
            style={[
              styles.avatar,
              {
                borderColor: isVisual ? '#FFE600' : isMotor ? '#7C3AED' : colors.border,
                borderWidth: isVisual || isMotor ? 2 : 1,
                width: isMotor ? 50 : 44,
                height: isMotor ? 50 : 44,
                borderRadius: isMotor ? 25 : 22,
              },
            ]}
          />
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: colors.text, fontSize: 16 * fontSizeScale }]}>
              {post.author.name}
            </Text>
            <Text style={[styles.authorHandle, { color: colors.textMuted, fontSize: 12 * fontSizeScale }]}>
              {post.author.handle} • {post.timestamp}
            </Text>
          </View>

          {/* Standart Modda Küçük Ses İkonu */}
          {!isVisual && (
            <TouchableOpacity
              onPress={handleToggleReadPostAndImage}
              style={[
                styles.smallListenBtn,
                {
                  backgroundColor: colors.inputBg,
                  width: isMotor ? 48 : 36,
                  height: isMotor ? 48 : 36,
                },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Sesli dinle"
            >
              {isReadingPost ? (
                <VolumeX size={18} color="#DC2626" />
              ) : (
                <Volume2 size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Nörogelişimsel Okuma Cetveli (Focus Ruler) Vurgusu */}
        {focusRulerActive && (
          <View style={styles.focusRulerBar}>
            <Text style={styles.focusRulerText}>🔎 Odaklı Okuma Alanı</Text>
          </View>
        )}

        {/* Gönderi Metni (Yazı) */}
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

        {/* Görsel */}
        {post.image && (
          <View style={styles.mediaContainer}>
            <Image source={{ uri: post.image }} style={styles.mediaImage} />

            {/* GÖRME ENGELLİ İÇİN: Görselin Altında Açık Türkçe Betimleme Kutusu */}
            {isVisual && post.aiDescription && (
              <View style={styles.visualDescriptionBox}>
                <View style={styles.visualBadgeRow}>
                  <Sparkles size={16} color="#FFE600" />
                  <Text style={styles.visualBadgeTitle}>Görsel Açıklaması (AI):</Text>
                </View>
                <Text style={[styles.visualDescText, { fontSize: 14 * fontSizeScale }]}>
                  {post.aiDescription}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Video */}
        {post.videoUrl && (
          <View style={styles.mediaContainer}>
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

            {/* SAĞIR KULLANICILAR İÇİN: TÜRK İŞARET DİLİ (TİD) TERCÜMAN KUTUSU */}
            {isHearing && (
              <View style={styles.tidOverlay}>
                <View style={styles.tidHeader}>
                  <UserCheck size={12} color="#FFFFFF" />
                  <Text style={styles.tidLabel}>🤟 TİD Çevirmeni</Text>
                </View>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' }}
                  style={styles.tidAvatar}
                />
                <Text style={styles.tidActiveText}>Canlı Aktarım</Text>
              </View>
            )}

            {/* Video Üzeri Canlı Altyazı */}
            <View style={styles.videoSubtitleBar}>
              <Text style={[styles.videoSubtitleText, { color: isVisual ? '#FFE600' : '#FFFFFF' }]}>
                {post.captions[currentCaptionIndex].text}
              </Text>
            </View>
          </View>
        )}

        {/* İŞİTME ENGELLİ (SAĞIR) İÇİN: DUYULAMAYAN ÇEVRESEL SESLERİN BETİMLEMESİ */}
        {isHearing && post.soundDescriptions && (
          <View style={styles.soundDescriptionContainer}>
            <View style={styles.soundHeaderRow}>
              <Ear size={16} color="#0284C7" />
              <Text style={styles.soundHeaderTitle}>
                Duyulamayan Çevresel Seslerin & Müziğin Betimlemesi:
              </Text>
            </View>
            <View style={styles.soundList}>
              {post.soundDescriptions.map((sound, sIdx) => (
                <Text key={sIdx} style={[styles.soundItemText, { fontSize: 13 * fontSizeScale }]}>
                  {sound}
                </Text>
              ))}
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Alt Etkileşim Butonları (Motor Engelliler İçin Devasa Dokunma Alanları) */}
      <View
        style={[
          styles.actionsRow,
          {
            borderTopColor: colors.border,
            borderTopWidth: isVisual || isMotor ? 2 : 1,
            paddingVertical: isMotor ? 14 : 10,
          },
        ]}
      >
        <View style={styles.leftActions}>
          <TouchableOpacity
            onPress={() => {
              setLiked(!liked);
              setLikeCount(liked ? likeCount - 1 : likeCount + 1);
            }}
            style={[styles.actionBtn, { minHeight: isMotor ? 54 : isVisual ? 48 : 40, minWidth: isMotor ? 54 : 44 }]}
          >
            <Heart
              size={isMotor ? 24 : 20}
              color={liked ? '#EF4444' : isVisual ? '#FFE600' : isMotor ? '#7C3AED' : colors.textMuted}
              fill={liked ? '#EF4444' : 'none'}
            />
            {!theme.hideClutter && (
              <Text style={[styles.actionCount, { color: colors.text, fontSize: (isMotor ? 14 : 13) * fontSizeScale }]}>
                {likeCount}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { minHeight: isMotor ? 54 : isVisual ? 48 : 40, minWidth: isMotor ? 54 : 44 }]}
          >
            <MessageCircle size={isMotor ? 24 : 20} color={isVisual ? '#FFE600' : isMotor ? '#7C3AED' : colors.textMuted} />
            {!theme.hideClutter && (
              <Text style={[styles.actionCount, { color: colors.text, fontSize: (isMotor ? 14 : 13) * fontSizeScale }]}>
                {post.comments}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { minHeight: isMotor ? 54 : isVisual ? 48 : 40, minWidth: isMotor ? 54 : 44 }]}
          >
            <Share2 size={isMotor ? 24 : 20} color={isVisual ? '#FFE600' : isMotor ? '#7C3AED' : colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setSaved(!saved)}
          style={[styles.actionBtn, { minHeight: isMotor ? 54 : isVisual ? 48 : 40, minWidth: isMotor ? 54 : 44 }]}
        >
          <Bookmark
            size={isMotor ? 24 : 20}
            color={saved ? colors.primary : isVisual ? '#FFE600' : isMotor ? '#7C3AED' : colors.textMuted}
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
  voiceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  voiceBannerText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  avatar: {
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
  smallListenBtn: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusRulerBar: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginBottom: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#0D9488',
  },
  focusRulerText: {
    color: '#0F766E',
    fontSize: 10,
    fontWeight: '800',
  },
  postText: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  mediaContainer: {
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: 230,
    resizeMode: 'cover',
  },
  visualDescriptionBox: {
    backgroundColor: '#000000',
    borderTopColor: '#FFE600',
    borderTopWidth: 2,
    padding: 14,
  },
  visualBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  visualBadgeTitle: {
    color: '#FFE600',
    fontSize: 13,
    fontWeight: '800',
  },
  visualDescText: {
    color: '#FFFFFF',
    lineHeight: 20,
    fontWeight: '600',
  },
  playBtn: {
    position: 'absolute',
    top: '38%',
    left: '42%',
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  tidOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(2, 132, 199, 0.95)',
    borderRadius: 10,
    padding: 6,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  tidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  tidLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tidAvatar: {
    width: 44,
    height: 44,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  tidActiveText: {
    color: '#BAE6FD',
    fontSize: 8,
    fontWeight: '700',
    marginTop: 2,
  },
  videoSubtitleBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  videoSubtitleText: {
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 13,
  },
  soundDescriptionContainer: {
    backgroundColor: '#E0F2FE',
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#38BDF8',
    padding: 12,
    marginVertical: 4,
  },
  soundHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  soundHeaderTitle: {
    color: '#0369A1',
    fontSize: 12,
    fontWeight: '800',
  },
  soundList: {
    gap: 4,
  },
  soundItemText: {
    color: '#0C4A6E',
    fontWeight: '600',
    lineHeight: 18,
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
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  actionCount: {
    fontWeight: '700',
  },
});
