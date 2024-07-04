<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { jwtDecode } from "jwt-decode";

const { status, data, signOut, signIn,  } = useAuth()
const id = computed(() => {
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
  <DropdownMenu v-if="status === 'authenticated'">
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative h-8 w-8 rounded-full">
        <Avatar class="h-8 w-8">
          <AvatarImage :src="data?.user?.image" alt="User Avatar" class="bg-white"/>
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ id?.given_name }} {{ id?.family_name }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ data?.user?.email }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <!-- <DropdownMenuItem>
          Billing
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>New Team</DropdownMenuItem> -->
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="signOut()" class="text-red-800 hover:text-red-800">
          Se Déconnecter
          <DropdownMenuShortcut><Icon class="ml-5" name="ic:sharp-log-out" size="20"/></DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <Button  v-else @click="signIn('auth0')"  variant="ghost" class="text-sm font-semibold leading-6 text-gray-900">
    <p class="text-primary">Se connecter</p>
  </Button>
</template>