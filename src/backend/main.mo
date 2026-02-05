// The main backend actor for blob storage.
import MixinStorage "blob-storage/Mixin";

actor {
  // Directly include the MixinStorage module.
  include MixinStorage();
};
