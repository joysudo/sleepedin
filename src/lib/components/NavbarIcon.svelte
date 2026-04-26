<script>
    let { iconUrl, iconAlt, text, link } = $props();
</script>

<a href={link}>
    <div class="flex flex-col items-center duration-200 hover:scale-105 active:scale-95">
        <img src={iconUrl} alt={iconAlt} class="w-12" />
        <h2 class="font-tommy-bold text-2xl text-purple-dark">{text}</h2>
    </div>
</a>
