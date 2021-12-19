let DataMining = require('../models/id3');
let express = require('express');
let router = express.Router();

new Promise((resolve, reject) => {
    let data = require('./data/data_1.js');
    resolve(data.data);
}).then((data) => {
    function DecisionTree(config) {
        if (typeof config == "object" && !Array.isArray(config)) this.training(config);
    };
    DecisionTree.prototype = {
        _predicates: { //分割函数
            '==': function (a, b) {
                return a == b
            }, //针对非数字值的比较
            '>=': function (a, b) {
                return a >= b
            } //针对数值的比较
        },
        //统计属性值在数据集中的次数
        countUniqueValues(items, attr) {
            //console.log(items);
            //console.log(attr)
            var counter = {}; // 获取不同的结果值 与出现次数
            for (var i of items) {
                //console.log(i)
                if (!counter[i[attr]]) counter[i[attr]] = 0;
                counter[i[attr]] += 1;
            }
            return counter;
        },
        //获取对象中值最大的Key  假设 counter={a:9,b:2} 得到 "a" 
        getMaxKey(counter) {
            var mostFrequentValue;
            for (var k in counter) {
                if (!mostFrequentValue) mostFrequentValue = k;
                if (counter[k] > counter[mostFrequentValue]) {
                    mostFrequentValue = k;
                }
            };
            return mostFrequentValue;
        },
        //寻找最频繁的特定属性值
        mostFrequentValue(items, attr) {
            return this.getMaxKey(this.countUniqueValues(items, attr)); //计算值的出现数
        },
        //根据属性切割数据集 
        split(items, attr, predicate, pivot) {
            var data = {
                match: [], //适合的数据集
                notMatch: [] //不适合的数据集
            }
            for (var item of items) { //遍历训练集  
                if (predicate(item[attr], pivot)) { //比较是否满足条件
                    data.match.push(item);
                } else {
                    data.notMatch.push(item);
                }
            };
            return data;
        },
        //计算熵
        entropy(items, attr) {
            var counter = this.countUniqueValues(items, attr); //计算值的出现数
            var p, entropy = 0; //H(S)=entropy=∑(P(Xi)(log2(P(Xi))))
            for (var i in counter) { //entropy+=-(P(Xi)(log2(P(Xi))))
                p = counter[i] / items.length; //P(Xi)概率值
                entropy += -p * Math.log2(p);
            }
            return entropy;
        },
        buildDecisionTree(config) {
            var trainingSet = config.trainingSet; //训练集
            var minItemsCount = config.minItemsCount; //训练集项数
            var categoryAttr = config.categoryAttr; //用于区分的类别属性
            var entropyThrehold = config.entropyThrehold; //熵阈值
            var maxTreeDepth = config.maxTreeDepth; //递归深度
            var ignoredAttributes = config.ignoredAttributes; //忽略的属性
            // 树最大深度为0 或训练集的大小 小于指定项数 终止树的构建过程
            if ((maxTreeDepth == 0) || (trainingSet.length <= minItemsCount)) {
                return {
                    category: this.mostFrequentValue(trainingSet, categoryAttr)
                };
            }
            //初始计算 训练集的熵
            var initialEntropy = this.entropy(trainingSet, categoryAttr); //<===H(S)
            //训练集熵太小 终止
            if (initialEntropy <= entropyThrehold) {
                return {
                    category: this.mostFrequentValue(trainingSet, categoryAttr)
                };
            }
            var alreadyChecked = []; //标识已经计算过了
            var bestSplit = {
                gain: 0
            }; //储存当前最佳的分割节点数据信息
            //遍历数据集
            for (var item of trainingSet) {
                // 遍历项中的所有属性
                for (var attr in item) {
                    //跳过区分属性与忽略属性
                    if ((attr == categoryAttr) || (ignoredAttributes.indexOf(attr) >= 0)) continue;
                    var pivot = item[attr]; // 当前属性的值 
                    var predicateName = ((typeof pivot == 'number') ? '>=' : '=='); //根据数据类型选择判断条件
                    var attrPredPivot = attr + predicateName + pivot;
                    if (alreadyChecked.indexOf(attrPredPivot) >= 0) continue; //已经计算过则跳过
                    alreadyChecked.push(attrPredPivot); //记录
                    var predicate = this._predicates[predicateName]; //匹配分割方式
                    var currSplit = this.split(trainingSet, attr, predicate, pivot);
                    var matchEntropy = this.entropy(currSplit.match, categoryAttr); //  H(match) 计算分割后合适的数据集的熵
                    var notMatchEntropy = this.entropy(currSplit.notMatch, categoryAttr); // H(on match) 计算分割后不合适的数据集的熵
                    //计算信息增益: 
                    // IG(A,S)=H(S)-(∑P(t)H(t))) 
                    // t为分裂的子集match(匹配),on match(不匹配)
                    // P(match)=match的长度/数据集的长度
                    // P(on match)=on match的长度/数据集的长度
                    var iGain = initialEntropy - ((matchEntropy * currSplit.match.length +
                        notMatchEntropy * currSplit.notMatch.length) / trainingSet.length);
                    //不断匹配最佳增益值对应的节点信息
                    if (iGain > bestSplit.gain) {
                        bestSplit = currSplit;
                        bestSplit.predicateName = predicateName;
                        bestSplit.predicate = predicate;
                        bestSplit.attribute = attr;
                        bestSplit.pivot = pivot;
                        bestSplit.gain = iGain;
                    }
                }
            }

            // 找不到最优分割
            if (!bestSplit.gain) {
                return {
                    category: this.mostFrequentValue(trainingSet, categoryAttr)
                };
            }
            // 递归绑定子树枝
            config.maxTreeDepth = maxTreeDepth - 1; //减小1深度
            config.trainingSet = bestSplit.match; //将切割 match 训练集作为下一节点的训练集
            var matchSubTree = this.buildDecisionTree(config); //递归匹配子树节点
            config.trainingSet = bestSplit.notMatch; //将切割 notMatch 训练集作为下一节点的训练集
            var notMatchSubTree = this.buildDecisionTree(config); //递归匹配子树节点 
            return {
                attribute: bestSplit.attribute,
                predicate: bestSplit.predicate,
                predicateName: bestSplit.predicateName,
                pivot: bestSplit.pivot,
                match: matchSubTree,
                notMatch: notMatchSubTree,
                matchedCount: bestSplit.match.length,
                notMatchedCount: bestSplit.notMatch.length
            };
        },
        training(config) {
            this.root = this.buildDecisionTree({
                trainingSet: config.trainingSet, //训练集
                ignoredAttributes: config.ignoredAttributes || [], // 被忽略的属性比如:姓名、名称之类的
                categoryAttr: config.categoryAttr || 'category', //用于区分的类别属性
                minItemsCount: config.minItemsCount || 1, //最小项数量
                entropyThrehold: config.entropyThrehold || 0.01, //熵阈值
                maxTreeDepth: config.maxTreeDepth || 70 //递归的最大深度 
            });
        },
        //预测 测试
        predict(data) {
            var attr, value, predicate, pivot;
            var tree = this.root;
            while (true) {
                if (tree.category) {
                    return tree.category;
                }
                attr = tree.attribute;
                value = data[attr];
                predicate = tree.predicate;
                pivot = tree.pivot;
                if (predicate(value, pivot)) {
                    tree = tree.match;
                } else {
                    tree = tree.notMatch;
                }
            }
        }
    };
    var decisionTree = new DecisionTree();
    console.log("函数 countUniqueValues 测试:");
    let countUniqueValues = {
        '长相' : decisionTree.countUniqueValues(data, "长相"),
        '年龄' : decisionTree.countUniqueValues(data, "年龄"),
        '收入' : decisionTree.countUniqueValues(data, "收入")
    }
    console.log("函数 entropy 测试:");
    let entropy = {
        '长相' : decisionTree.entropy(data, "长相"),
        '年龄' : decisionTree.entropy(data, "年龄"),
        '收入' : decisionTree.entropy(data, "收入")
    }
    console.log("函数 mostFrequentValue 测试:");
    let mostFrequentValue = {
        '年龄' : decisionTree.mostFrequentValue(data, "年龄"),
        '长相' : decisionTree.mostFrequentValue(data, "长相"),
        '收入' : decisionTree.mostFrequentValue(data, "收入")
    }
    console.log("函数 split 测试:");
    let split = {
        '长相' : JSON.stringify(decisionTree.split(data, "长相", (a, b) => {
            return a == b
        }, "不帅")),
        '年龄' : JSON.stringify(decisionTree.split(data, "年龄", (a, b) => {
            return a >= b
        }, 30)),
        '年龄' : JSON.stringify(decisionTree.split(data, "年龄", (a, b) => {
            return a < b
        }, 25))
    }
    let body = {
        countUniqueValues: countUniqueValues,
        entropy: entropy,
        mostFrequentValue: mostFrequentValue,
        split: split
    }
    decisionTree.training({
        trainingSet: data, //训练集
        categoryAttr: '见面', //用于区分的类别属性 
        ignoredAttributes: ['姓名'] //被忽略的属性
    });
    // 测试决策树与随机森林
    // var comic = {
    //     "姓名": "刘建1",
    //     "年龄": 21,
    //     "长相": "帅",
    //     "体型": "瘦",
    //     "收入": "高"
    // };
    // console.log(comic, decisionTree.predict(comic));
    

    //配置路由
    new DataMining(body).save(function(err, datamining) {
        if(err) {
            console.log('出错了');
        }
        console.log(datamining);
        router.get('/data_mining', async function(req, res, next) {
            try {
                var data = await DataMining.find();
                return res.status(200).json(data);
            } catch (err) {
                next(err);
            }
        })
    })

    router.post('/data_mining', function(req, res) {
        //console.log(Object.keys(req.body)[0]);
        const data = JSON.parse(Object.keys(req.body)[0]);
        console.log(data)
        //console.log(decisionTree.predict(data));
        const forecast = decisionTree.predict(data)
        res.status(200).json({
            code: 200,
            res: forecast
        })
    })
})
module.exports = router;