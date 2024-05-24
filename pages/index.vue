<template>
  <div class="flex-1 space-y-4 p-8 pt-6">
    <Tabs default-value="overview" class="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">
          Loc. Longue Durée
        </TabsTrigger>
        <TabsTrigger value="analytics" disabled>
          Loc. Saisonnière
        </TabsTrigger>
        <TabsTrigger value="reports" disabled>
          Achat/Vente
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>