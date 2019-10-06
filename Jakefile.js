var subLibNames = ["events", "random", "time"];

task('default', ['bundle', 'minify']);

task('bundle', function(){
    jake.exec("rollup -i src/index.js -o dist/hyperapp-r.js --no-esModule -mf cjs -n hyperapp_r", {printStdout: true, printStderr: true});
    for(var subLibName of subLibNames){
        jake.exec(`rollup -i lib/${subLibName}/src/index.js -o lib/${subLibName}/dist/hyperapp-r-${subLibName}.js --no-esModule -mf cjs -n hyperapp_r_${subLibName}`, {printStdout: true, printStderr: true});
    }
});

task('minify', function(){
    jake.exec("terser dist/hyperapp-r.js -o dist/hyperapp-r.min.js -mc --source-map includeSources,url=hyperapp-r.min.js.map", {printStdout: true, printStderr: true});
    for(var subLibName of subLibNames){
        jake.exec(`terser lib/${subLibName}/dist/hyperapp-r-${subLibName}.js -o lib/${subLibName}/dist/hyperapp-r-${subLibName}.min.js -mc --source-map includeSources,url=hyperapp-r-${subLibName}.min.js.map`, {printStdout: true, printStderr: true});
    }
});

task('distclean', function(){
    jake.exec("rimraf dist/*");
    for(var subLibName of subLibNames){
        jake.exec(`rimraf lib/${subLibName}/dist/*`);
    }
});