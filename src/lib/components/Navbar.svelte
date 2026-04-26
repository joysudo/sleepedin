<script>
    import NavbarIcon from "./NavbarIcon.svelte";
</script>

<div
    class="p-4 flex flex-row items-center justify-between w-screen bg-linear-to-b from-white/50 to-pink-light/50 backdrop-blur-md"
>
    <img src="sleepedinlogo.png" alt="sleepedin logo" class="w-1/5" />

    <!-- links -->
    <div class="m-4 flex flex-row gap-12">
        <NavbarIcon
            iconUrl="icons/explore.png"
            iconAlt="explore page icon"
            text="explore"
            link="/explore"
        />

        <NavbarIcon
            iconUrl="icons/home.png"
            iconAlt="home page icon"
            text="home"
            link="/home"
        />

        <NavbarIcon
            iconUrl="icons/logout.png"
            iconAlt="logout icon"
            text="log out"
            link="/landing" // fix this later add onclick popup "r u sure u wanna log out blablabla"
        />
    </div>
</div>

<hr class="border border-purple-dark mb-4" />
