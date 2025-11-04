<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <title>Dashboard</title>
    <!-- Inclure Tailwind CSS via CDN par simplicité -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">

    <!-- Header -->
    <header class="bg-blue-600 p-4 text-white flex justify-between items-center">
        <h1 class="text-xl font-bold">Admin Dashboard</h1>
        <nav>
            <a href="<?= site_url('dashboard'); ?>" class="mr-4">Dashboard</a>
            <a href="#produits" class="mr-4">Produits</a>
            <a href="#packs">Packs</a>
        </nav>
    </header>

    <!-- Contenu -->
    <main class="p-6">

        <!-- Section Produits -->
        <section id="produits" class="mb-8">
            <h2 class="text-2xl mb-4">Produits</h2>
            <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="py-2 px-4 text-left">ID</th>
                        <th class="py-2 px-4 text-left">Nom</th>
                        <th class="py-2 px-4 text-left">Prix</th>
                    </tr>
                </thead>
                <tbody id="produits-list">
                    <!-- Rempli par JS -->
                </tbody>
            </table>
        </section>

        <!-- Section Packs -->
        <section id="packs">
            <h2 class="text-2xl mb-4">Packs</h2>
            <ul id="packs-list" class="bg-white p-4 rounded shadow-md list-disc list-inside">
                <!-- Rempli par JS -->
            </ul>
        </section>

    </main>

    <!-- JS pour charger les données -->
    <script>
    async function loadProduits() {
        const res = await fetch('<?= site_url('produits') ?>');
        const produits = await res.json();
        const list = document.getElementById('produits-list');
        list.innerHTML = '';
        produits.forEach(p => {
            list.innerHTML += `
                <tr class="border-b">
                    <td class="py-2 px-4">${p.id}</td>
                    <td class="py-2 px-4">${p.nom}</td>
                    <td class="py-2 px-4">${p.prix}</td>
                </tr>
            `;
        });
    }

    async function loadPacks() {
        const res = await fetch('<?= site_url('packs') ?>');
        const packs = await res.json();
        const list = document.getElementById('packs-list');
        list.innerHTML = '';
        packs.forEach(pack => {
            list.innerHTML += `<li>${pack.nom} (${pack.produits_count} produits)</li>`;
        });
    }

    // Charger au démarrage
    loadProduits();
    loadPacks();
    </script>

</body>
</html>
