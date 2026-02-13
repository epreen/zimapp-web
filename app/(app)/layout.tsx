import { AppShell } from '@/components/shells/app-shell';
// import Footer from '@/components/ui/layout/footer'
import { Header } from '@/components/ui/layout/header';

import { StoreProvider } from '@/components/providers/store-provider';
import { MenuStoreProvider } from '@/components/providers/menu-store-provider';
import { CartStoreProvider } from '@/components/providers/cart-store-provider';
import { ChatStoreProvider } from '@/components/providers/chat-store-provider';
import { SearchStoreProvider } from '@/components/providers/search-store-provider';
import { ReactNode } from 'react';

import { MenuSheet } from '@/components/ui/sheets/menu-sheet';
import { CartSheet } from '@/components/ui/sheets/cart-sheet';
import { ChatSheet } from '@/components/ui/sheets/chat-sheet';
import SearchModal from '@/components/ui/modals/search-modal';

function Layout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <StoreProvider>
      <MenuStoreProvider>
        <CartStoreProvider>
          <ChatStoreProvider>
            <SearchStoreProvider>
              <AppShell>
                <Header/>
                <main className='mx-auto min-h-screen'>
                  {children}
                </main>
                {/* <Footer/> */}
              </AppShell>
              <MenuSheet />
              <CartSheet />
              <ChatSheet />
              <SearchModal />
            </SearchStoreProvider>
          </ChatStoreProvider>
        </CartStoreProvider>
      </MenuStoreProvider>
    </StoreProvider>
  )
}

export default Layout