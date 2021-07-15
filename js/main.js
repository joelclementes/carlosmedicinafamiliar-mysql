$('.navbar-nav>li>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});

$('.navbar>a').on('click', function(){
    $('.navbar-collapse').collapse('hide');
});

var url = "http://localhost/carlosmedicinafamiliar/backend/crud.php";
new Vue({
    el: '#VueServicios',
    data() {
        return {
            servicios: [],
            dialog: false,
            operacion: '',
        }
    },
    created() {
        this.mostrar();
    },
    methods: {
        mostrar: function () {
            axios.post(url, { proceso: "PACIENTES_SELECT_ALL" })
                .then(response => {
                    this.servicios = response.data;
                })
        }
    }
})