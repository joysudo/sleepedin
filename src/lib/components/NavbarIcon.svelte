<script>
    let { iconUrl, iconAlt, text } = $props();
</script>

<div class="flex flex-col items-center">
    <img src={iconUrl} alt={iconAlt} class="w-12" />
    <h2 class="font-tommy-bold text-2xl text-purple-dark">{text}</h2>
</div>
