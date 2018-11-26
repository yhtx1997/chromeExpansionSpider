chrome.devtools.panels.create("Spider", "", "./index/index.html");
var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        quantity: 1,
        select: 0,
        path: [],
        min: [],
        max: [],
        url: [],
        info: [],
        lock: false
    },
    methods: {
        selectClick(e) {
            console.log(e);
            this.select = e;
        },
        addClick() {
            let path = [];
            let min = [];
            let max = [];
            for (let index = 0; index < this.quantity; index++) {
                path.push(this.$refs.path[index].value);
                min.push(this.$refs.min[index].value);
                max.push(this.$refs.max[index].value);
            }
            this.path = path;
            this.min = min;
            this.max = max;

            this.generateUrl();
        },
        generateUrl() {
            let url = [];
            let path = this.path;
            let min = this.min;
            let max = this.max;

            for (let p = 0; p <= path.length; p++) {
                for (let mi = min[p]; mi <= max[p]; mi++) {
                    url.push(path[p] + mi);
                }
            }

            this.url = url;
            this.selectClick(1);

        },
        startCilck() {
            if (this.lock != true) {
                this.lock = true;
                let index = -1;
                const openUrl = setInterval(() => {
                    if (index < this.url.length) {
                        index++;
                    } else {
                        clearInterval(openUrl);
                        this.lock=false;
                    }
                    if(this.url[index] != 'undefined'){
                        chrome.tabs.create({
                            url: this.url[index],
                        },()=>{
                            chrome.tabs.executeScript({
                                code:
                                    `
                                        setTimeout(function(){var save = document.querySelector("input[name='_save']");
                                        save.click();},5000);
                                        setTimeout(function(){window.close()},6000);
                                    `
                            });
                        });
                        this.info.push(this.url[index] + ' 完成');
                    }
                    
                    
                }, 1000);
            }



        },
        deleteCilck() {
            this.url = [];
            this.lock=false;
            this.info = [];
            this.info.push('已刪除');
        }
    },
    watch: {
        path(val) {
            this.info = val;
        }
    }
})