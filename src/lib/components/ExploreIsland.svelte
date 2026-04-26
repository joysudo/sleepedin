<script>
    let randomIslandNumber = Math.floor(Math.random() * 5);;
    let randomIsland = "/images/explore_island_" + randomIslandNumber + ".png";
    let {
        username = "coolperson123",
        imgUrl = randomIsland,
    } = $props(); //fix username prop later it's a placeholder
</script>

<a href={"/user/" + username}
    ><div class="flex flex-col place-items-center text-center">
        <img
            src={imgUrl}
            alt="someone's dreamland island"
            class="w-[80%] m-4 hover:scale-107 animate-[float_2s_ease-in-out_infinite_alternate] hover:animate-[bigfloat_1s_ease-in-out_infinite_alternate] active:scale-90 active:m-2 hover:m-6 duration-600"
        />
        <h2
            class="font-tommy-bold text-3xl hover:scale-105 duration-200 text-purple-dark"
        >
            {username}
        </h2>
    </div>
</a>
