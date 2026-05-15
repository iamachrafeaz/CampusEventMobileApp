import { colors } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { ImagePlus, X } from 'lucide-react-native';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ImagePickerInput({image , setImage, setIsDeleted} : {image : string | null, setImage : (newImg : string | null) => void, setIsDeleted : (val : boolean) => void}) {

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission requise', 'L\'accès à la galerie est nécessaire.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [7,9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {setIsDeleted(true) ; setImage(null)};

  return (
    <View>
      <TouchableOpacity 
        style={[styles.container, image && styles.containerWithImage]} 
        onPress={pickImage}
        activeOpacity={0.7}
      >
        {!image ? (
          <View style={styles.placeholder}>
            <View style={styles.iconCircle}>
              <ImagePlus size={32} color={colors.primary.main} />
            </View>
            <Text style={styles.title}>Ajouter une photo</Text>
            <Text style={styles.subtitle}>Format recommandé : 4:3</Text>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity style={styles.removeBadge} onPress={removeImage}>
              <X size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: colors.ui.backgroundAlt,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.ui.border,
    borderStyle: 'dashed', 
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  containerWithImage: {
    borderStyle: 'solid',
  },
  placeholder: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
  },
  removeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  }
});