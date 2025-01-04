// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const types = [
	{ value: 'feat', name: 'feat:     新增功能      | A new feature' },
	{ value: 'fix', name: 'fix:      修复缺陷      | A bug fix' },
	{
		value: 'docs',
		name: 'docs:     文档更新      | Documentation only changes',
	},
	{
		value: 'style',
		name: 'style:    代码格式      | Changes that do not affect the meaning of the code',
	},
	{
		value: 'refactor',
		name: 'refactor: 代码重构      | A code change that neither fixes a bug nor adds a feature',
	},
	{
		value: 'perf',
		name: 'perf:     性能提升      | A code change that improves performance',
	},
	{
		value: 'test',
		name: 'test:     测试相关      | Adding missing tests or correcting existing tests',
	},
	{
		value: 'build',
		name: 'build:    构建相关      | Changes that affect the build system or external dependencies',
	},
	{
		value: 'ci',
		name: 'ci:       持续集成      | Changes to our CI configuration files and scripts',
	},
	{ value: 'del', name: 'del:      删除代码/文件 | Delete the code/file' },
	{ value: 'revert', name: 'revert:   回退代码      | Revert to a commit' },
	{
		value: 'chore',
		name: 'chore:    构建变动      | Changes to the build process or accessibility',
	},
];

// .commitlintrc.js
/** @type {import('cz-git').UserConfig} */
// eslint-disable-next-line no-undef
module.exports = {
	rules: {
		'body-leading-blank': [1, 'always'],
		'footer-leading-blank': [1, 'always'],
		'header-max-length': [2, 'always', 72],
		'scope-case': [2, 'always', 'lower-case'],
		'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
		'subject-empty': [2, 'never'],
		'subject-full-stop': [2, 'never', '.'],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
		'type-enum': [
			2,
			'always',
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			['init', ...types.map((t) => t.value)],
		],
	},
	prompt: {
		alias: { fd: 'docs: fix typos' },
		messages: {
			type: '选择你要提交的类型 :',
			scope: '选择一个提交范围（可选）:',
			customScope: '请输入自定义的提交范围 :',
			subject: '填写简短精炼的变更描述 :\n',
			body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
			breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
			footerPrefixesSelect: '选择关联issue前缀（可选）:',
			customFooterPrefix: '输入自定义issue前缀 :',
			footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
			confirmCommit: '是否提交或修改commit ?',
		},
		types,
		useEmoji: false,
		emojiAlign: 'center',
		themeColorCode: '',
		allowCustomScopes: true,
		allowEmptyScopes: true,
		customScopesAlign: 'bottom',
		customScopesAlias: '自定义',
		emptyScopesAlias: '跳过',
		upperCaseSubject: false,
		markBreakingChangeMode: false,
		allowBreakingChanges: ['feat', 'fix'],
		breaklineNumber: 100,
		breaklineChar: '|',
		skipQuestions: ['body', 'breaking', 'footer', 'footerPrefix'],
		issuePrefixes: [
			// 如果使用 gitee 作为开发管理
			{ value: 'link', name: 'link:     链接 ISSUES 进行中' },
			{ value: 'closed', name: 'closed:   标记 ISSUES 已完成' },
		],
		customIssuePrefixAlign: 'top',
		emptyIssuePrefixAlias: 'skip',
		customIssuePrefixAlias: 'custom',
		allowCustomIssuePrefix: true,
		allowEmptyIssuePrefix: true,
		confirmColorize: true,
		maxHeaderLength: Infinity,
		maxSubjectLength: Infinity,
		minSubjectLength: 0,
		scopeOverrides: undefined,
		defaultBody: '',
		defaultIssues: '',
		defaultScope: '',
		defaultSubject: '',
	},
};
