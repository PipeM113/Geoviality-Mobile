import * as FileSystem from "expo-file-system";

// TODO: Documentar esto
function useCacheManager() {
  const borrarCache = async () => {
    const cacheDirPath = FileSystem.cacheDirectory;
    if (!cacheDirPath) {
      return;
    }

    const filesArray = await FileSystem.readDirectoryAsync(cacheDirPath);

    // console.log("useCacheManager - Archivos a borrar:", filesArray);

    for (const file of filesArray) {
      console.log("useCacheManager - Borrando archivo:", file);
      await FileSystem.deleteAsync(`${cacheDirPath}${file}`);
    }

    console.log("useCacheManager - Cache borrada.");
  };

  return { borrarCache };
}

export default useCacheManager;
