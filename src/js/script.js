Number.prototype.comma_formatter = function() {
    return this.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

let chartData = function(){
    return {
        date: 'today',
        options: [
            {
                label: 'Hoje',
                value: 'today',
            },
            {
                label: 'Últimos 7 dias',
                value: '7days',
            },
            {
                label: 'Últimos 30 dias',
                value: '30days',
            },
            {
                label: 'Últimos 6 meses',
                value: '6months',
            },
            {
                label: 'Esse ano',
                value: 'year',
            },
        ],
        showDropdown: false,
        selectedOption: 0,
        selectOption: function(index){
            this.selectedOption = index;
            this.date = this.options[index].value;
            this.renderChart();
        },
        data: null,
        fetch: function(){
            fetch('https://cdn.jsdelivr.net/gh/swindon/fake-api@master/tailwindAlpineJsChartJsEx1.json')
                .then(res => res.json())
                .then(res => {
                    this.data = res.dates;
                    this.renderChart();
                })
        },
        renderChart: function(){
            let c = false;

            Chart.helpers.each(Chart.instances, function(instance) {
                if (instance.chart.canvas.id == 'chart') {
                    c = instance;
                }
            });

            if(c) {
                c.destroy();
            }

            let ctx = document.getElementById('chart').getContext('2d');

            let chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: this.data[this.date].data.labels,
                    datasets: [
                        {
                            label: "Ouro",
                            backgroundColor: "rgba(255, 215, 0, 0.2)",
                            borderColor: "rgb(255, 215, 0)",
                            pointBackgroundColor: "rgb(255, 215, 0)",
                            data: this.data[this.date].data.income,
                        },
                        {
                            label: "Cobre",
                            backgroundColor: "rgba(192, 192, 192, 0.25)",
                            borderColor: "rgba(192, 192, 192, 1)",
                            pointBackgroundColor: "rgba(192, 192, 192, 1)",
                            data: this.data[this.date].data.expenses,
                        },
                    ],
                },
                layout: {
                    padding: {
                        right: 10
                    }
                },
                options: {
                    scales: {
                        yAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                callback: function(value,index,array) {
                                    return value > 1000 ? ((value < 1000000) ? value/1000 + 'K' : value/1000000 + 'M') : value;
                                }
                            }
                        }]
                    }
                }
            });
        }
    }
}