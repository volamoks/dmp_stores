import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import StoreListWrapper from "@/components/store-list-wrapper";
import { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 15;

type StoreWithZones = Prisma.StoreGetPayload<{
  include: {
    dmpZones: {
      include: {
        bookings: true;
      };
    };
  };
}>;

type Status = "Свободен" | "Занят" | "В ожидании";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Fetch initial stores data with bookings included
  const stores = await prisma.store.findMany({
    take: ITEMS_PER_PAGE,
    include: {
      dmpZones: {
        include: {
          bookings: true,
        },
      },
    },
  });

  // Transform the data to include status
  const transformedStores = stores.map((store: StoreWithZones) => ({
    id: store.id,
    externalId: store.externalId,
    name: store.name,
    region: store.region,
    city: store.city,
    newFormat: store.newFormat,
    equipmentFormat: store.equipmentFormat,
    dmpZones: store.dmpZones.map((zone) => ({
      id: zone.id,
      uniqueId: zone.uniqueId,
      zoneId: zone.zoneId,
      equipment: zone.equipment,
      dmpProductNeighboring: zone.dmpProductNeighboring,
      purpose: zone.purpose,
      subPurpose: zone.subPurpose,
      category: zone.category,
      supplier: zone.supplier,
      brand: zone.brand,
      productCategory: zone.productCategory,
      storeId: zone.storeId,
      comment: zone.comment,
      price: zone.price,
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt,
      status: (zone.bookings.length > 0 ? 'Занят' : 'Свободен') as Status
    }))
  }));

  const totalStores = await prisma.store.count();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-7xl space-y-8">
        <StoreListWrapper 
          initialStores={transformedStores}
          totalStores={totalStores}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </main>
  );
}
