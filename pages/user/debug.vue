<script setup lang="ts">
import { jwtDecode } from "jwt-decode";

const { status, data, signOut, signIn,  } = useAuth()
const decodedAccessToken = computed(() => {
  if (data?.value?.account?.access_token) {
    try {
      return jwtDecode(data.value.account.access_token)
    } catch (error) {
      console.error('Invalid access token:', error)
      return null
    }
  }
  return null
})
const decoedIdToken = computed(() => {
  if (data?.value?.account?.id_token) {
    try {
      return jwtDecode(data.value.account.id_token)
    } catch (error) {
      console.error('Invalid access token:', error)
      return null
    }
  }
  return null
})
</script>

<template>
  <div class="w-full max-w-5xl mx-auto bg-white px-5 py-4 rounded-t shadow-xl">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <img
          v-if="status === 'authenticated' && data?.user?.image"
          class="w-12 h-12 rounded-full"
          :src="data.user.image"
          alt="User Avatar"
        >
        <h1 v-if="status === 'authenticated'" class="text-lg">
          Authenticated as {{ data?.user?.name }}!
        </h1>
        <h1 v-else>
          Not logged in
        </h1>
      </div>
      <button v-if="status === 'authenticated'" class="flex items-center justify-center space-x-2 bg-red-500 text-black rounded-lg py-2 px-3 text-lg" @click="signOut({ callbackUrl: '/' })">
        <span>Logout</span>
      </button>
      <button v-else class="flex items-center justify-center space-x-2 bg-green-500 text-black rounded-lg py-2 px-3 text-lg" @click="signIn('auth0')">
        <i class="fa fa-right-to-bracket pt-0.5" />
        <span>Login</span>
      </button>

    </div>
    <div class=" items-center">
      <div class=" items-center space-x-2 mt-8">
            <h1>USER</h1>
            <TechPrettyJson :json="data.user" />
      </div>
      <div class=" items-center space-x-2 mt-8">
            <h1>ACCESS_TOKEN</h1>
            <TechPrettyJson :json="data.account.access_token" comment="Raw Acces Token" />
            <TechPrettyJson :json="decodedAccessToken" comment="Decoded Access Token" />
      </div>
      <div class=" items-center space-x-2 mt-8">
            <h1>ID_TOKEN</h1>
            <TechPrettyJson :json="data.account.id_token" comment="Raw ID Token"/>
            <TechPrettyJson :json="decoedIdToken" comment="Decoded ID Token"/>
      </div>
    </div>
  </div>

</template>
