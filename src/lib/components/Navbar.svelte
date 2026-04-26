<script>
    import NavbarIcon from "./NavbarIcon.svelte";
</script>

<div class="p-4 flex flex-row items-center justify-between w-screen">
    <img
        src="sleepedinlogo.png"
        alt="sleepedin logo"
        class="w-1/5"
    />
    <!-- links -->
    <div class="m-4 flex flex-row gap-12">
        <NavbarIcon iconUrl="icons/explore.png" iconAlt="explore page icon" text="explore"/>
        <NavbarIcon iconUrl="icons/home.png" iconAlt="home page icon" text="home"/>
        <NavbarIcon iconUrl="icons/logout.png" iconAlt="logout icon" text="log out"/>               
    </div>
</div>
